import { VoiceConfig } from '@/types';

// ElevenLabs Voice IDs — easy to swap here
// Use eleven_multilingual_v2 model for German support
export const VOICE_CONFIGS: Record<string, VoiceConfig> = {
  muhammad: {
    key: 'muhammad',
    name: 'Muhammad',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam — supports multilingual v2
    description: 'Ruhig und klar',
  },
  ahmad: {
    key: 'ahmad',
    name: 'Ahmad',
    voiceId: 'ErXwobaYiN019PkySvjV', // Antoni — supports multilingual v2
    description: 'Freundlich und professionell',
  },
};

export const VOICE_LIST = Object.values(VOICE_CONFIGS);
