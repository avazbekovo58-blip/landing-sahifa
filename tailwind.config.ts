import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        'surface-3': '#242424',
        accent: '#6366f1',
        'accent-dim': 'rgba(99,102,241,0.15)',
        border: '#2a2a2a',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(99,102,241,0.25)' },
          '50%': { boxShadow: '0 0 50px rgba(99,102,241,0.55)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        dots: {
          '0%,20%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        glow: 'glow 2.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'spin-slow': 'spin 3s linear infinite',
        dots: 'dots 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
