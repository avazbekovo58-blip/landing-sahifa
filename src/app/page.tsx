'use client';

import { AnimatePresence } from 'framer-motion';
import { useIELTSTest } from '@/hooks/useIELTSTest';
import { VoiceSelector } from '@/components/VoiceSelector';
import { SpeakingInterface } from '@/components/SpeakingInterface';
import { CalculatingScreen } from '@/components/CalculatingScreen';
import { ResultsScreen } from '@/components/ResultsScreen';

export default function Home() {
  const {
    currentStep,
    selectedVoice,
    setSelectedVoice,
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
  } = useIELTSTest();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <AnimatePresence mode="wait">
        {currentStep === 'voice-select' && (
          <VoiceSelector
            key="voice-select"
            selectedVoice={selectedVoice}
            onSelect={setSelectedVoice}
            onStart={startTest}
          />
        )}

        {currentStep === 'speaking' && (
          <SpeakingInterface
            key="speaking"
            questionCount={questionCount}
            currentQuestion={currentQuestion}
            recording={recording}
            playing={playing}
            loading={loading}
            error={error}
            onStopRecording={stopRecording}
          />
        )}

        {currentStep === 'calculating' && <CalculatingScreen key="calculating" />}

        {currentStep === 'results' && evaluationResult && (
          <ResultsScreen
            key="results"
            result={evaluationResult}
            onReset={resetTest}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
