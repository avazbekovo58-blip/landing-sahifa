'use client';

import { motion } from 'framer-motion';
import { VOICE_LIST } from '@/lib/voices';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelect: (key: string) => void;
  onStart: () => void;
}

export function VoiceSelector({ selectedVoice, onSelect, onStart }: VoiceSelectorProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#111] text-xs text-[#6366f1] tracking-widest uppercase font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
          Deutsch Sprechtest
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Wähle deinen
          <br />
          <span className="text-[#818cf8]">Prüfer aus</span>
        </h1>
        <p className="mt-4 text-[#6b7280] text-base max-w-sm mx-auto">
          Du wirst 5 Fragen auf Deutsch beantworten. Deine Leistung wird am Ende bewertet.
        </p>
      </motion.div>

      {/* Voice Cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md">
        {VOICE_LIST.map((voice, i) => {
          const isSelected = selectedVoice === voice.key;
          return (
            <motion.button
              key={voice.key}
              onClick={() => onSelect(voice.key)}
              className={[
                'flex-1 relative flex flex-col items-center gap-4 p-7 rounded-2xl border transition-all duration-300 cursor-pointer',
                isSelected
                  ? 'border-[#6366f1] bg-[#1a1a2e] shadow-[0_0_30px_rgba(99,102,241,0.25)]'
                  : 'border-[#2a2a2a] bg-[#111] hover:border-[#3a3a4a] hover:bg-[#161616]',
              ].join(' ')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Avatar */}
              <div
                className={[
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300',
                  isSelected
                    ? 'bg-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                    : 'bg-[#1f1f1f] text-[#6b7280]',
                ].join(' ')}
              >
                {voice.name[0]}
              </div>

              <div className="text-center">
                <p className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-[#d1d5db]'}`}>
                  {voice.name}
                </p>
                <p className="text-xs text-[#6b7280] mt-1">{voice.description}</p>
              </div>

              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#6366f1]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Start Button */}
      <motion.button
        onClick={onStart}
        className={[
          'px-10 py-4 rounded-2xl text-base font-semibold tracking-wide transition-all duration-300',
          'bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-[0_0_30px_rgba(99,102,241,0.35)]',
          'hover:shadow-[0_0_50px_rgba(99,102,241,0.55)] active:scale-95',
        ].join(' ')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Test starten →
      </motion.button>
    </motion.div>
  );
}
