/** Hexagon icons of the dial stations: SVG markup centred at 0,0 (trusted static data). */
export const STATION_ICONS = {
  contacto:
    '<path d="M0 -3V9M-6 -8Q-9 -3 -6 2M6 -8Q9 -3 6 2M-10 -11Q-15 -3 -10 5M10 -11Q15 -3 10 5" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="0" cy="-3" r="2.4" fill="currentColor"/>',
  videos:
    '<rect x="-10" y="-7" width="20" height="14" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M-3 -4L5 0L-3 4Z" fill="currentColor"/>',
  lecturas:
    '<path d="M-7 -10H4L8 -6V10H-7Z" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M-4 -2H5M-4 2H5M-4 6H2" stroke="currentColor" stroke-width="1.6"/>',
  audios:
    '<rect x="-3.5" y="-11" width="7" height="12" rx="3.5" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M-8 -2Q-8 6 0 6Q8 6 8 -2M0 6V10" stroke="currentColor" stroke-width="1.8" fill="none"/>',
} as const;

export type StationIcon = keyof typeof STATION_ICONS;
