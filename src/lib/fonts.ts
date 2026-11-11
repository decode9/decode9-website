import { Archivo, Barlow_Condensed, JetBrains_Mono, Sedgwick_Ave_Display, Share_Tech_Mono, Teko } from 'next/font/google';

/*
 * Fonts of the original pages, self-hosted by next/font and exposed as CSS variables on <html>:
 *  --font-archivo   entrada (D9 Body 400/600/800) y perfil (variable, eje wdth, normal/itálica)
 *  --font-barlow    entrada (D9 Sport 700/800/900 itálica) y terminal (400/500/600)
 *  --font-tag       entrada y perfil (D9 Tag, Sedgwick Ave Display)
 *  --font-teko      terminal y transmisor (400/500/600)
 *  --font-share     terminal y transmisor (Share Tech Mono)
 *  --font-jetbrains perfil (400/500)
 */
export const archivo = Archivo({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
  display: 'swap',
});

export const sedgwick = Sedgwick_Ave_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-tag',
  display: 'swap',
});

export const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-teko',
  display: 'swap',
  preload: false,
});

export const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-share',
  display: 'swap',
  preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const fontVariables = [archivo, barlowCondensed, sedgwick, teko, shareTechMono, jetbrainsMono]
  .map((font) => font.variable)
  .join(' ');
