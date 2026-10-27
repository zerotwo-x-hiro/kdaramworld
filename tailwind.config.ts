import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--bg-primary) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--bg-surface) / <alpha-value>)',
          elevated: 'rgb(var(--bg-surface-elevated) / <alpha-value>)',
        },
        scrim: 'rgb(var(--bg-scrim) / <alpha-value>)',
        border: {
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
        },
        dancheong: {
          red: 'rgb(var(--dancheong-red) / <alpha-value>)',
          blue: 'rgb(var(--dancheong-blue) / <alpha-value>)',
          celadon: 'rgb(var(--dancheong-celadon) / <alpha-value>)',
          gold: 'rgb(var(--dancheong-gold) / <alpha-value>)',
          rose: 'rgb(var(--dancheong-rose) / <alpha-value>)',
        },
        tint: {
          subtle: 'rgb(var(--tint-subtle) / <alpha-value>)',
          medium: 'rgb(var(--tint-medium) / <alpha-value>)',
          strong: 'rgb(var(--tint-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'var(--font-gowun-batang)', 'serif'],
        sans: ['var(--font-pretendard)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serifKo: ['var(--font-gowun-batang)', 'serif'],
        accent: ['var(--font-black-han-sans)', 'sans-serif'],
      },
      animation: {
        'petal-fall': 'petalFall 7s linear infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        petalFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg) translateX(0)', opacity: '0.9' },
          '50%': { transform: 'translateY(50vh) rotate(180deg) translateX(30px)', opacity: '0.7' },
          '100%': { transform: 'translateY(105vh) rotate(360deg) translateX(-20px)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      borderRadius: {
        theme: '10px',
        card: '14px',
        modal: '20px',
      },
      boxShadow: {
        elevation: '0 8px 30px -8px rgba(0, 0, 0, 0.4)',
        glowRed: '0 0 20px -3px rgba(232, 77, 91, 0.35)',
        glowGold: '0 0 20px -3px rgba(240, 185, 75, 0.35)',
        glowCeladon: '0 0 20px -3px rgba(64, 196, 168, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
