'use client';

import { motion } from 'framer-motion';
import { EvaluationResult } from '@/types';

interface ResultsScreenProps {
  result: EvaluationResult;
  onReset: () => void;
}

interface ScoreRingProps {
  score: number;
  size?: number;
}

function ScoreRing({ score, size = 100 }: ScoreRingProps) {
  const radius = (size - 12) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(score / 9, 1);
  const offset = circ * (1 - pct);

  const color =
    score >= 7 ? '#34d399' : score >= 5 ? '#f59e0b' : '#f87171';

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1f1f1f" strokeWidth={6} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

interface SubScoreCardProps {
  label: string;
  score: number;
  delay?: number;
}

function SubScoreCard({ label, score, delay = 0 }: SubScoreCardProps) {
  const color =
    score >= 7 ? 'text-emerald-400' : score >= 5 ? 'text-amber-400' : 'text-red-400';

  return (
    <motion.div
      className="flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#2a2a2a] bg-[#111]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.4 }}
    >
      <ScoreRing score={score} size={76} />
      <div className="text-center">
        <p className={`text-2xl font-bold ${color}`}>{score.toFixed(1)}</p>
        <p className="text-xs text-[#6b7280] mt-0.5 leading-snug">{label}</p>
      </div>
    </motion.div>
  );
}

function bandLabel(score: number): string {
  if (score >= 8) return 'Ausgezeichnet (C2)';
  if (score >= 7) return 'Sehr gut (C1)';
  if (score >= 6) return 'Gut (B2)';
  if (score >= 5) return 'Befriedigend (B1)';
  if (score >= 4) return 'Grundkenntnisse (A2)';
  return 'Anfänger (A1)';
}

export function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const overallColor =
    result.overall_band_score >= 7
      ? 'text-emerald-400'
      : result.overall_band_score >= 5
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen px-6 py-12 max-w-2xl mx-auto gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <p className="text-xs text-[#6366f1] tracking-widest uppercase font-medium mb-2">
          Testergebnis
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Deine Ergebnisse</h1>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-[#6366f1]/30 bg-[#0d0d1f] w-full shadow-[0_0_40px_rgba(99,102,241,0.15)]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ScoreRing score={result.overall_band_score} size={140} />
        <div className="text-center -mt-4">
          <p className={`text-5xl font-extrabold ${overallColor}`}>
            {result.overall_band_score.toFixed(1)}
          </p>
          <p className="text-sm text-[#6b7280] mt-1">{bandLabel(result.overall_band_score)}</p>
        </div>
      </motion.div>

      {/* Sub Scores */}
      <div className="flex gap-3 w-full">
        <SubScoreCard label="Flüssigkeit" score={result.fluency_score} delay={0} />
        <SubScoreCard label="Wortschatz" score={result.lexical_resource_score} delay={0.1} />
        <SubScoreCard label="Grammatik" score={result.grammatical_range_score} delay={0.2} />
      </div>

      {/* Tips */}
      <motion.div
        className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
          Persönliche Empfehlungen
        </h3>
        <ul className="flex flex-col gap-3">
          {result.personalized_tips.map((tip, i) => (
            <motion.li
              key={i}
              className="flex gap-3 text-sm text-[#d1d5db] leading-relaxed"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.35 }}
            >
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#6366f1]/20 text-[#818cf8] text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              {tip}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Reset button */}
      <motion.button
        onClick={onReset}
        className="w-full max-w-xs py-4 rounded-2xl text-sm font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:shadow-[0_0_45px_rgba(99,102,241,0.5)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        ↺  Erneut starten
      </motion.button>
    </motion.div>
  );
}
