import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Du bist ein offizieller Deutschprüfer (ähnlich dem TestDaF- oder DSH-Format).
Deine Aufgabe ist es, genau 5 Fragen auf Deutsch zu stellen — eine nach der anderen.
Warte nach jeder Frage auf die Antwort des Kandidaten.

Mögliche Themen: tägliches Leben, Familie, Hobbys, Beruf, Zukunftspläne, Reisen, gesellschaftliche Themen, Meinungen zu aktuellen Ereignissen.

Regeln:
- Stelle NUR die Frage — kein Kommentar, keine Bewertung, kein zusätzlicher Text.
- Sei höflich und professionell.
- Fragen sollen offen und gesprächsfördernd sein.
- Beginne die Frage direkt, ohne Einleitung wie "Natürlich" oder "Gerne".`;

interface ConversationEntry {
  role: 'examiner' | 'candidate';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { history, questionCount } = await req.json() as {
      history: ConversationEntry[];
      questionCount: number;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const conversationContext =
      history.length > 0
        ? '\n\nBisheriger Gesprächsverlauf:\n' +
          history
            .map((e) => `${e.role === 'examiner' ? 'Prüfer' : 'Kandidat'}: ${e.text}`)
            .join('\n')
        : '';

    const instruction =
      questionCount === 0
        ? 'Beginne den Deutschtest jetzt. Stelle die erste Frage.'
        : `Stelle jetzt Frage ${questionCount + 1} von 5.`;

    const fullPrompt = `${SYSTEM_PROMPT}${conversationContext}\n\n${instruction}`;

    const result = await model.generateContent(fullPrompt);
    const question = result.response.text().trim();

    return NextResponse.json({ question });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
