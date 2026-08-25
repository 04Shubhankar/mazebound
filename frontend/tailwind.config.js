/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: '#111726',
          border: '#1f293d',
          accent: '#38bdf8',
          accentGlow: '#0284c7',
          neonGreen: '#10b981',
          neonPurple: '#a855f7',
          neonOrange: '#f97316',
          wall: '#1e293b',
          wallBorder: '#334155'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'trail-fade': 'trailFade 0.8s ease-out forwards'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.8))' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)', filter: 'drop-shadow(0 0 18px rgba(56, 189, 248, 1))' }
        }
      }
    },
  },
  plugins: [],
}
