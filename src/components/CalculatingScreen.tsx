'use client';

import { motion } from 'framer-motion';

export function CalculatingScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated rings */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#6366f1]/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-[#6366f1]/50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <div className="w-14 h-14 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Deine Leistung wird ausgewertet
        </h2>
        <p className="text-[#6b7280] text-sm">
          KI analysiert deine Antworten…
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-[#6366f1]"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -6, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
