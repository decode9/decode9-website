import type { Bilingual, TerminalMenuItem, TerminalScreenId, WireTarget } from '@/interfaces/terminal';

export const MENU: readonly TerminalMenuItem[] = [
  { id: 'home', n: '00', t: ['Inicio', 'Start'], st: ['Archivo abierto', 'Open file'] },
  { id: 'manifiesto', n: '01', t: ['Manifiesto', 'Manifesto'], st: ['Juzgar o investigar', 'Judge or investigate'] },
  { id: 'origen', n: '02', t: ['Expediente de origen', 'Origin file'], st: ['8 registros', '8 logs'] },
  { id: 'lab', n: '03', t: ['Laboratorio', 'Lab'], st: ['Hoja de personaje', 'Character sheet'] },
  { id: 'codice', n: '04', t: ['Códice', 'Codex'], st: ['Razas y lugares', 'Races and places'] },
  { id: 'archivo', n: '05', t: ['Archivo', 'Archive'], st: ['Señales recibidas', 'Signals received'] },
  { id: 'canal', n: '06', t: ['Canal', 'Channel'], st: ['Publicaciones', 'Posts'] },
  { id: 'enlace', n: '07', t: ['Enlace', 'Link'], st: ['Transmisor', 'Transmitter'] },
  { id: 'tx', n: '08', t: ['Iniciar transmisor', 'Start transmitter'], st: ['Llévalo al celular', 'Take it to your phone'] },
];

export const SCREEN_IDS: readonly TerminalScreenId[] = MENU.map((item) => item.id);

/** Wire logo / HUD mini-map position per screen (original POS). */
export const WIRE_TARGETS: Record<TerminalScreenId, WireTarget> = {
  home: { x: 0.72, y: 0.5, s: 1.25 },
  manifiesto: { x: 0.86, y: 0.3, s: 0.7 },
  origen: { x: 0.14, y: 0.78, s: 0.6 },
  lab: { x: 0.9, y: 0.78, s: 0.6 },
  codice: { x: 0.5, y: 0.2, s: 0.6 },
  archivo: { x: 0.82, y: 0.5, s: 0.8 },
  canal: { x: 0.86, y: 0.72, s: 0.6 },
  enlace: { x: 0.12, y: 0.3, s: 0.6 },
  tx: { x: 0.8, y: 0.4, s: 0.7 },
};

/** Tab rows of the screens that have them (original S.manifiesto / S.codice). */
export const MANIFESTO_TABS: readonly Bilingual[] = [
  ['Sesgo', 'Bias'],
  ['Método', 'Method'],
  ['Lo que ves', 'What you see'],
  ['Conocimiento', 'Knowledge'],
];

export const CODEX_TABS: readonly Bilingual[] = [
  ['Todo', 'All'],
  ['Razas', 'Races'],
  ['Lugares y sucesos', 'Places & events'],
];
