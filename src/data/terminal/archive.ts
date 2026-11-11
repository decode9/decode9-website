import type { ArchiveSignal, Bilingual } from '@/interfaces/terminal';

/** Archivo: received signals (original ARC). */
export const ARCHIVE_SIGNALS: readonly ArchiveSignal[] = [
  { n: 'Stargate', k: ['Película','Film'], f: '101.3', s: 4, d: ['Un portal a otra dimensión y alguien que llega a entender y construir en un mundo nuevo.','A portal to another dimension, and someone who arrives to understand and build in a new world.'] },
  { n: 'Factorio', k: ['Videojuego','Game'], f: '88.7', s: 4, d: ['Construir sistemas en un mundo hostil y automatizarlo todo.','Building systems in a hostile world and automating everything.'] },
  { n: 'Nikola Tesla', k: ['Inventor','Inventor'], f: '60.0', s: 3, d: ['Imaginar lo que todavía no existe y convertir lo imposible en tecnología.','Imagining what doesn’t exist yet and turning the impossible into technology.'] },
  { n: 'Midudev', k: ['Divulgador','Educator'], f: '104.9', s: 4, d: ['Aprender, construir y compartir. Compartir lo aprendido también es construir tecnología.','Learn, build and share. Sharing what you learn is part of building technology.'] },
  { n: 'Elon Musk', k: ['Ingeniería','Engineering'], f: '92.1', s: 2, d: ['Cuestionar los límites y pensar desde principios fundamentales. Por su visión de ingeniería, no por todas sus opiniones.','Questioning limits and thinking from first principles. For his engineering vision, not all his opinions.'] },
];

/** The Wow! signal (hidden channel of the Archive). */
export const WOW_SIGNAL = {
  code: '6EQUJ5',
  title: 'CH·?? · 6EQUJ5',
  channel: 'CH·??',
  freq: '1420',
  source: 'Big Ear · Ohio State University · 15 · AGO · 1977',
  link: 'https://www.history.com/this-day-in-history/august-15/wow-signal-detected',
  linkLabel: 'History ↗',
  body: [
    'Durante 72 segundos, un radiotelescopio registró una señal tan intensa que el astrónomo Jerry Ehman encerró los caracteres en rojo y escribió «Wow!» al margen. Se buscó durante décadas. Nunca volvió a aparecer.',
    'For 72 seconds a radio telescope recorded a signal so strong that astronomer Jerry Ehman circled the characters in red and wrote “Wow!” in the margin. It was searched for over decades. It never came back.',
  ] as Bilingual,
  gloss: [
    'Una observación que nadie puede repetir todavía no es conocimiento: es una pregunta abierta. Por eso queda en el archivo, sin conclusiones.',
    'An observation no one can repeat isn’t knowledge yet: it’s an open question. That’s why it stays in the archive, without conclusions.',
  ] as Bilingual,
} as const;

export const ARCHIVE_TEXT = {
  listTitle: ['Señales recibidas', 'Signals received'],
} as const satisfies Record<string, Bilingual>;
