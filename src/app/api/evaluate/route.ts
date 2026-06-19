import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const EVAL_SYSTEM = `Du bist ein zertifizierter Deutschprüfer mit langjähriger Erfahrung.
Analysiere das folgende Gesprächsprotokoll und bewerte die mündlichen Deutschkenntnisse des Kandidaten.

Bewertungsskala: 1.0 bis 9.0 (analog zum IELTS-Band-System)
- 1–3: Anfänger (A1-A2)
- 4–5: Mittelstufe (B1-B2)
- 6–7: Fortgeschritten (B2-C1)
- 8–9: Experte (C1-C2)

Kriterien:
- fluency_score: Flüssigkeit, natürlicher Redefluss, Pausen, Zögern
- lexical_resource_score: Wortschatzreichtum, Präzision, Ausdrucksvielfalt
- grammatical_range_score: Korrektheit, Komplexität der Satzstrukturen
- overall_band_score: Gewichteter Durchschnitt der drei Kriterien
- personalized_tips: 3 konkrete, konstruktive Verbesserungshinweise auf Deutsch

Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt in genau diesem Format:

{
  "overall_band_score": 7.0,
  "fluency_score": 7.0,
  "lexical_resource_score": 6.5,
  "grammatical_range_score": 7.0,
  "personalized_tips": ["Tipp 1...", "Tipp 2...", "Tipp 3..."]
}

Kein Markdown, keine Erklärung, kein zusätzlicher Text.`;

interface ConversationEntry {
  role: 'examiner' | 'candidate';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json() as { history: ConversationEntry[] };

    if (!history || history.length === 0) {
      return NextResponse.json({ error: 'No conversation history provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const transcript = history
      .map((e) => `${e.role === 'examiner' ? 'Prüfer' : 'Kandidat'}: ${e.text}`)
      .join('\n');

    const prompt = `${EVAL_SYSTEM}\n\nGesprächsprotokoll:\n${transcript}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Extract JSON even if wrapped in code block
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', raw);
      return NextResponse.json({ error: 'Invalid evaluation format from AI' }, { status: 502 });
    }

    const evaluation = JSON.parse(jsonMatch[0]);
    return NextResponse.json(evaluation);
  } catch (err) {
    console.error('Evaluate route error:', err);
    return NextResponse.json({ error: 'Failed to evaluate performance' }, { status: 500 });
  }
}
