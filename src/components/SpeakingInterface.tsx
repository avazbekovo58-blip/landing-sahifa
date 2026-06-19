'use client';

import { motion } from 'framer-motion';
import { WaveformVisualizer } from './WaveformVisualizer';

interface SpeakingInterfaceProps {
  questionCount: number;
  currentQuestion: string;
  recording: boolean;
  playing: boolean;
  loading: boolean;
  error: string | null;
  onStopRecording: () => void;
}

function StatusBadge({ recording, playing, loading }: { recording: boolean; playing: boolean; loading: boolean }) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-[#6b7280]">
        <span className="w-2 h-2 rounded-full bg-[#6b7280] animate-pulse" />
        Nächste Frage wird vorbereitet…
      </span>
    );
  }
  if (playing) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-[#818cf8]">
        <span className="w-2 h-2 rounded-full bg-[#818cf8] animate-pulse" />
        Prüfer spricht…
      </span>
    );
  }
  if (recording) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Deine Antwort wird aufgenommen
      </span>
    );
  }
  return <span className="text-sm text-[#3a3a3a]">Warte…</span>;
}

export function SpeakingInterface({
  questionCount,
  currentQuestion,
  recording,
  playing,
  loading,
  error,
  onStopRecording,
}: SpeakingInterfaceProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-between min-h-screen px-6 py-12 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top: counter */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs text-[#6b7280] tracking-widest uppercase">Deutschtest</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={[
                'w-2 h-2 rounded-full transition-all duration-300',
                i < questionCount ? 'bg-[#6366f1]' : 'bg-[#2a2a2a]',
              ].join(' ')}
            />
          ))}
          <span className="ml-2 text-sm text-[#6b7280] font-mono">
            {questionCount}/5
          </span>
        </div>
      </div>

      {/* Middle: question + waveform */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full py-10">
        {/* Question box */}
        <motion.div
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111] p-7"
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#4a4a6a] text-base">Frage wird geladen…</span>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#6366f1] tracking-widest uppercase font-medium mb-3">
                Frage {questionCount} von 5
              </p>
              <p className="text-xl md:text-2xl font-medium text-white leading-snug">
                {currentQuestion}
              </p>
            </>
          )}
        </motion.div>

        {/* Waveform */}
        <div
          className={[
            'w-full rounded-2xl border transition-all duration-500 overflow-hidden',
            recording
              ? 'h-28 border-emerald-500/40 bg-[#0d1a10] shadow-[0_0_30px_rgba(52,211,153,0.1)]'
              : playing
              ? 'h-28 border-[#6366f1]/40 bg-[#0d0d1a] shadow-[0_0_30px_rgba(99,102,241,0.1)]'
              : 'h-16 border-[#1a1a1a] bg-[#0a0a0a]',
          ].join(' ')}
        >
          <WaveformVisualizer isRecording={recording} isPlaying={playing} />
        </div>

        {/* Status */}
        <StatusBadge recording={recording} playing={playing} loading={loading} />

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 text-center max-w-sm">{error}</p>
        )}
      </div>

      {/* Bottom: control button */}
      <div className="w-full flex flex-col items-center gap-4">
        <motion.button
          onClick={onStopRecording}
          disabled={!recording}
          className={[
            'w-full max-w-xs py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300',
            recording
              ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
              : 'bg-[#1a1a1a] text-[#3a3a3a] cursor-not-allowed',
          ].join(' ')}
          whileHover={recording ? { scale: 1.02 } : {}}
          whileTap={recording ? { scale: 0.97 } : {}}
        >
          {recording ? '✓  Antwort beendet' : 'Warte auf Frage…'}
        </motion.button>

        <p className="text-xs text-[#3a3a3a] text-center">
          Sprich deutlich auf Deutsch. Die Aufnahme endet automatisch nach einer Pause.
        </p>
      </div>
    </motion.div>
  );
}
