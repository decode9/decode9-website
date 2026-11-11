import type { Config } from 'tailwindcss'

/*
 * Tailwind is kept for shared tokens only; page styles live in CSS Modules.
 * Preflight stays on (it is the reset the ported pages assume: box-sizing, margins).
 */
const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        barlow: ['var(--font-barlow)', '"Arial Narrow"', 'sans-serif'],
        tag: ['var(--font-tag)', 'cursive'],
        teko: ['var(--font-teko)', 'Impact', 'sans-serif'],
        share: ['var(--font-share)', 'ui-monospace', 'monospace'],
        jetbrains: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
