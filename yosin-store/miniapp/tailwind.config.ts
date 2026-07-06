import type { Config } from 'tailwindcss';

// Yosin Store design system — premium, warm, mobile-first.
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // primary — emerald
        primary: {
          DEFAULT: '#0F6E56',
          bright: '#1D9E75',
          soft: '#9FE1CB',
          tint: '#E1F5EE',
        },
        // accent — coral (CTAs, discount badges)
        accent: {
          DEFAULT: '#D85A30',
          deep: '#993C1D',
          tint: '#FAECE7',
        },
        // surfaces / neutrals
        cream: '#FBF8F2',
        surface: '#FFFFFF',
        ink: '#2B2A28',
        muted: '#6B6A66',
        line: '#ECE7DD',
        // dark mode
        'd-bg': '#12110F',
        'd-surface': '#1B1A17',
        'd-line': '#2C2A26',
        'd-ink': '#F3EFE8',
        'd-muted': '#A8A49C',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        btn: '12px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,42,40,0.04), 0 6px 20px -8px rgba(43,42,40,0.10)',
        card: '0 1px 2px rgba(43,42,40,0.04), 0 10px 30px -14px rgba(43,42,40,0.14)',
        cta: '0 8px 20px -6px rgba(216,90,48,0.45)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        shimmer: 'shimmer 1.4s infinite',
        pop: 'pop 0.3s ease',
      },
    },
  },
  plugins: [],
};

export default config;
