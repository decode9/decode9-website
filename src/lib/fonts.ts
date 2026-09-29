import { Chakra_Petch, JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google';

// Variable fonts where available: one file per family instead of one per weight.
export const headingFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });

export const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const labelFont = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-label',
  display: 'swap',
  preload: false,
});

export const codeFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
  preload: false,
});

export const fontVariables = [headingFont, bodyFont, labelFont, codeFont].map((font) => font.variable).join(' ');
