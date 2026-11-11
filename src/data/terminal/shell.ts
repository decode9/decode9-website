/** Static readouts of the terminal shell (side-menu sliders, HUD). */
export interface NavSlider {
  label: string;
  /** Fill height in %. */
  level: number;
  /** Amber fill instead of red. */
  accent?: boolean;
}

export const NAV_SLIDERS: readonly NavSlider[] = [
  { label: 'CUR', level: 72 },
  { label: 'INV', level: 100, accent: true },
  { label: 'SIG', level: 58 },
];

/** HUD signal box: frequency label and bar count (bar i is 5 + 3·i px tall). */
export const HUD_SIGNAL = { freq: '147.9 MHZ', bars: 6 } as const;
