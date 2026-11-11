import type { StationIcon } from './icons';
import { PORTRAITS, type PortraitImage } from './portraits';

export interface Station {
  name: string;
  freq: string;
  portrait: PortraitImage;
  icon: StationIcon;
}

/** Dial stations, in pane order (pane i ↔ station i). */
export const STATIONS: readonly Station[] = [
  { name: 'CONTACTO', freq: '147.9', portrait: PORTRAITS.listen, icon: 'contacto' },
  { name: 'VIDEOS', freq: '141.5', portrait: PORTRAITS.talk, icon: 'videos' },
  { name: 'LECTURAS', freq: '140.6', portrait: PORTRAITS.think, icon: 'lecturas' },
  { name: 'AUDIOS', freq: '139.8', portrait: PORTRAITS.listen, icon: 'audios' },
];

/** Dial geometry in the 390×196 SVG viewBox: degrees between stations and the ring centre. */
export const DIAL = { step: 24, cx: 195, cy: 306 } as const;

/** Intro line of each pane (phase 3b renders the rest of the pane). */
export const PANE_INTROS: readonly string[] = [
  'Investigador en campo, dime cómo te llamo y por dónde te encuentro. Una línea basta: el resto lo hablamos en persona.',
  'Grabé esto para quien llegara hasta aquí. Elige una transmisión; mírala dos veces, la segunda verás otra cosa.',
  'Mis bitácoras de campo. Si no tienes tiempo de leer, pide que te las lean.',
  'Para escuchar caminando. El conocimiento también se lleva en el bolsillo.',
];
