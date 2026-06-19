'use client';

import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  isPlaying: boolean;
}

export function WaveformVisualizer({ isRecording, isPlaying }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const cleanup = () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    };

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const BAR_COUNT = 40;

    const drawBars = (values: number[]) => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      const total = BAR_COUNT;
      const barW = (w / total) * 0.55;
      const gap = (w / total) * 0.45;

      for (let i = 0; i < total; i++) {
        const v = values[i] ?? 0.04;
        const bh = Math.max(4, v * h * 0.82);
        const x = i * (barW + gap) + gap / 2;
        const y = (h - bh) / 2;

        const grad = ctx.createLinearGradient(x, y + bh, x, y);
        grad.addColorStop(0, `rgba(99,102,241,${0.15 + v * 0.25})`);
        grad.addColorStop(0.5, `rgba(129,140,248,${0.5 + v * 0.4})`);
        grad.addColorStop(1, `rgba(167,139,250,${0.7 + v * 0.3})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        const r = Math.min(barW / 2, 3);
        ctx.roundRect(x, y, barW, bh, r);
        ctx.fill();
      }
    };

    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          const audioCtx = new AudioContext();
          audioCtxRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 128;
          source.connect(analyser);
          analyserRef.current = analyser;

          const freq = new Uint8Array(analyser.frequencyBinCount);

          const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(freq);
            const vals = Array.from(freq).map((v) => v / 255);
            // Show only first BAR_COUNT bins
            drawBars(vals.slice(0, BAR_COUNT));
          };
          draw();
        })
        .catch(console.error);
    } else if (isPlaying) {
      let t = 0;
      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        t += 0.07;
        const vals = Array.from({ length: BAR_COUNT }, (_, i) => {
          const wave =
            0.35 + 0.35 * Math.sin(t + i * 0.35) + 0.1 * Math.sin(t * 1.8 + i * 0.6);
          return Math.max(0.04, wave);
        });
        drawBars(vals);
      };
      draw();
    } else {
      // Idle — tiny static bars
      const idle = Array.from({ length: BAR_COUNT }, () => 0.04);
      drawBars(idle);
    }

    return cleanup;
  }, [isRecording, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
