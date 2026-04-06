/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0d9488', foreground: '#f0fdfa' },
        correct: '#22c55e',
        wrong: '#ef4444',
        level: {
          junior: '#3b82f6',
          middle: '#f59e0b',
          senior: '#a855f7',
        },
      },
      fontFamily: { mono: ['Geist Mono', 'JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
};