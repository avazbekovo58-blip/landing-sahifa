'use client';

import { useState, useRef } from 'react';
import { Step, ConversationEntry, EvaluationResult } from '@/types';

export function useIELTSTest() {
  const [currentStep, setCurrentStep] = useState<Step>('voice-select');
  const [selectedVoice, setSelectedVoice] = useState<string>('muhammad');
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs hold mutable flow state to avoid stale closures in async callbacks
  const historyRef = useRef<ConversationEntry[]>([]);
  const countRef = useRef(0);
  const voiceRef = useRef('muhammad');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const activeRef = useRef(false); // prevents double-execution after reset

  const syncVoice = (v: string) => {
    setSelectedVoice(v);
    voiceRef.current = v;
  };

  // ── TTS ────────────────────────────────────────────────────────────────────
  const playTTS = async (text: string): Promise<void> => {
    setPlaying(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceKey: voiceRef.current }),
      });

      if (!res.ok) throw new Error(`TTS failed: ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      await new Promise<void>((resolve) => {
        const audio = new Audio(url);
        const cleanup = () => {
          URL.revokeObjectURL(url);
          setPlaying(false);
          resolve();
        };
        audio.onended = cleanup;
        audio.onerror = cleanup;
        audio.play().catch(cleanup);
      });
    } catch (err) {
      setPlaying(false);
      throw err;
    }
  };

  // ── Speech Recognition ─────────────────────────────────────────────────────
  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Dein Browser unterstützt keine Spracherkennung. Bitte Chrome verwenden.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let transcript = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      transcript = event.results[0][0].transcript;
    };

    recognition.onend = () => {
      setRecording(false);
      if (!activeRef.current) return;
      if (transcript.trim()) {
        handleAnswer(transcript.trim());
      } else {
        // No speech detected: re-start recording
        startRecording();
      }
    };

    recognition.onerror = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  // ── Answer handler ─────────────────────────────────────────────────────────
  const handleAnswer = async (answer: string) => {
    if (!activeRef.current) return;

    const newHistory: ConversationEntry[] = [
      ...historyRef.current,
      { role: 'candidate', text: answer },
    ];
    const newCount = countRef.current + 1;

    historyRef.current = newHistory;
    countRef.current = newCount;
    setConversationHistory([...newHistory]);
    setQuestionCount(newCount);

    if (newCount >= 5) {
      setCurrentStep('calculating');
      try {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history: newHistory }),
        });
        const data = await res.json();
        setEvaluationResult(data);
        setCurrentStep('results');
      } catch (err) {
        console.error('Evaluation error:', err);
        setError('Auswertung fehlgeschlagen. Bitte erneut versuchen.');
      }
    } else {
      await askQuestion();
    }
  };

  // ── Ask next question ──────────────────────────────────────────────────────
  const askQuestion = async () => {
    if (!activeRef.current) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyRef.current,
          questionCount: countRef.current,
        }),
      });

      if (!res.ok) throw new Error(`Chat failed: ${res.status}`);

      const data = await res.json();
      const question: string = data.question;

      const newHistory: ConversationEntry[] = [
        ...historyRef.current,
        { role: 'examiner', text: question },
      ];
      historyRef.current = newHistory;
      setConversationHistory([...newHistory]);
      setCurrentQuestion(question);
      setLoading(false);

      if (!activeRef.current) return;
      await playTTS(question);

      if (!activeRef.current) return;
      startRecording();
    } catch (err) {
      setLoading(false);
      console.error('askQuestion error:', err);
      setError('Verbindungsfehler. Bitte überprüfe deine Internetverbindung.');
    }
  };

  // ── Public actions ─────────────────────────────────────────────────────────
  const startTest = async () => {
    historyRef.current = [];
    countRef.current = 0;
    activeRef.current = true;
    setConversationHistory([]);
    setQuestionCount(0);
    setCurrentQuestion('');
    setError(null);
    setCurrentStep('speaking');
    await askQuestion();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };

  const resetTest = () => {
    activeRef.current = false;
    try { recognitionRef.current?.stop(); } catch {}
    historyRef.current = [];
    countRef.current = 0;
    setCurrentStep('voice-select');
    setConversationHistory([]);
    setQuestionCount(0);
    setRecording(false);
    setPlaying(false);
    setLoading(false);
    setCurrentQuestion('');
    setEvaluationResult(null);
    setError(null);
  };

  return {
    currentStep,
    selectedVoice,
    setSelectedVoice: syncVoice,
    conversationHistory,
    questionCount,
    recording,
    playing,
    loading,
    currentQuestion,
    evaluationResult,
    error,
    startTest,
    stopRecording,
    resetTest,
  };
}
