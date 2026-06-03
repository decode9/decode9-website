import type { Config } from 'tailwindcss'

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
        // New brand palette
        brand: {
          red: '#E5121B',
          'red-dark': '#8E0408',
          'red-light': '#FF2A33',
        },
        // New ink/graphite dark palette
        ink: {
          950: '#0B0C0E',
          900: '#111214',
          800: '#18191C',
          700: '#22242A',
          600: '#2E3038',
          500: '#3D4049',
          400: '#5A5D68',
          300: '#7E8290',
          200: '#B0B4BF',
          100: '#D4D7DE',
          50: '#F4F6F8',
        },
        // Keep primary mapped to new brand red for backward compat
        primary: {
          50: '#FFF1F1',
          100: '#FFD9DA',
          200: '#FFB3B5',
          300: '#FF7C7F',
          400: '#FF3D40',
          500: '#E5121B',
          600: '#C00E16',
          700: '#990B12',
          800: '#7A0C11',
          900: '#600F13',
          950: '#480103',
        },
        // State colors
        success: {
          DEFAULT: '#1FA85C',
          fg: '#1FA85C',
        },
        warning: {
          DEFAULT: '#E0A526',
        },
        error: {
          DEFAULT: '#EF3E46',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        label: ['Chakra Petch', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'red-energy': 'linear-gradient(165deg, #FF2A33 0%, #E5121B 60%, #8E0408 100%)',
      },
      backgroundSize: {
        grid: '50px 50px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'reveal': 'reveal 0.6s ease forwards',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      maxWidth: {
        container: '1200px',
        wide: '1320px',
      },
    },
  },
  plugins: [],
}

export default config
