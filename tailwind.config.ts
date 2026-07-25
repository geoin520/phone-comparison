import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          blue: '#00f0ff',
          pink: '#ff00ff',
          purple: '#8b00ff',
          dark: '#0a0a0f',
          'dark-card': '#0d0d1a',
          'dark-border': '#1a1a2e',
          text: '#e8e8f0',
          muted: '#8899aa',
        },
      },
      fontFamily: {
        grotesk: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 5px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-pink': '0 0 5px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
        'neon-purple': '0 0 5px rgba(139, 0, 255, 0.5), 0 0 20px rgba(139, 0, 255, 0.3)',
        'neon-sm': '0 0 3px rgba(0, 240, 255, 0.4)',
      },
      backgroundImage: {
        'cyber-radial':
          'radial-gradient(circle at 20% 20%, rgba(0, 240, 255, 0.08), transparent 40%), radial-gradient(circle at 80% 30%, rgba(255, 0, 255, 0.06), transparent 40%), radial-gradient(circle at 50% 80%, rgba(139, 0, 255, 0.08), transparent 45%)',
        'grid-lines':
          'linear-gradient(rgba(26, 26, 46, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 26, 46, 0.4) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.5)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100%': { opacity: '1' },
          '20%, 21.9%, 63%, 63.9%, 65%, 69.9%': { opacity: '0.4' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        flicker: 'flicker 4s linear infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
