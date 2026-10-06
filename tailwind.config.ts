import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        surface: '#121824',
        'surface-elevated': '#1A2234',
        'surface-border': '#222F46',
        brand: {
          neon: '#CCFF00',
          volt: '#D4FF00',
          dark: '#080C12',
          red: '#FF3B30',
          orange: '#FF8A00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Impact', 'Oswald', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 25px -3px rgba(204, 255, 0, 0.45)',
        'neon-sm': '0 0 12px -2px rgba(204, 255, 0, 0.35)',
        'red-glow': '0 0 20px -3px rgba(255, 59, 48, 0.45)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
