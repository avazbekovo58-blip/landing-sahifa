export type Step = 'voice-select' | 'speaking' | 'calculating' | 'results';

export interface ConversationEntry {
  role: 'examiner' | 'candidate';
  text: string;
}

export interface EvaluationResult {
  overall_band_score: number;
  fluency_score: number;
  lexical_resource_score: number;
  grammatical_range_score: number;
  personalized_tips: string[];
}

export interface VoiceConfig {
  key: string;
  name: string;
  voiceId: string;
  description: string;
}
