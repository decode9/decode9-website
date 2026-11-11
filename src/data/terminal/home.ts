import type { Bilingual } from '@/interfaces/terminal';

/** Inicio · Escaneo: labels around the subject (original OPENERS.home). */
export const SCAN_TEXT = {
  title: ['Escaneo · OBJ-09', 'Scan · OBJ-09'],
  alt: 'decode9: demonoide de piel roja, cuernos y ojos ámbar que siguen tu cursor',
  target: 'OBJ-09',
  subject: ['SUJETO', 'SUBJECT'],
  race: ['RAZA', 'RACE'],
  demonoid: ['DEMONOIDE', 'DEMONOID'],
  origin: ['ORIGEN', 'ORIGIN'],
  alignment: ['ALINEAMIENTO', 'ALIGNMENT'],
  researcher: ['INVESTIGADOR', 'RESEARCHER'],
  gaze: ['MIRADA', 'GAZE'],
  mute: ['Silenciar', 'Mute'],
  listen: ['Escuchar', 'Listen'],
  muteLabel: 'Silenciar señal / Mute signal',
  listenLabel: 'Escuchar señal / Play signal',
  info: 'SPUTNIK 1 · 1957 · 20.005 MHz',
} as const;

/** Inicio · Expediente D9-09. */
export const FILE_TEXT = {
  title: ['Expediente D9-09', 'File D9-09'],
  subtitle: ['Sujeto 09 · Alma curiosa · Archivo abierto', 'Subject 09 · Curious soul · Open file'],
  file: ['Expediente', 'File'],
  clearance: ['Clasificación', 'Clearance'],
  open: ['Abierto', 'Open'],
  contents: ['Contenido', 'Contents'],
  sections: ['07 secciones', '07 sections'],
  status: ['Estado', 'Status'],
  investigating: ['En investigación', 'Under investigation'],
  cta: ['Abrir expediente', 'Open file'],
} as const satisfies Record<string, Bilingual>;

/** Inicio · Bitácora: lines that scroll every 1.6 s (index 4 is green). */
export const BLOG_LINES: readonly Bilingual[] = [
  ['analizando sesgo de observación…', 'analyzing observation bias…'],
  ['hipótesis 0x2F: lista para prueba', 'hypothesis 0x2F: ready for testing'],
  ['experimento 114 en curso', 'experiment 114 running'],
  ['prueba fallida → corrigiendo', 'test failed → correcting'],
  ['nuevo hallazgo registrado ✓', 'new finding logged ✓'],
  ['pregunta nueva abierta', 'new question opened'],
];

export const BLOG_TEXT = {
  title: ['Bitácora', 'Log'],
} as const satisfies Record<string, Bilingual>;

/** Window opened by the "SPUTNIK 1 ?" button. */
export const SPUTNIK_TEXT = {
  title: ['Señal · Sputnik 1', 'Signal · Sputnik 1'],
  date: '4 · OCT · 1957',
  quote: ['La primera señal humana desde la órbita.', 'The first human signal from orbit.'] as Bilingual,
  body: [
    'Sputnik 1 emitía pulsos de unos 0,3 segundos en 20,005 y 40,002 MHz. Radioaficionados de todo el mundo la escucharon: fue el día en que la especie empezó a hablar desde fuera del planeta. Lo que suena aquí es una recreación sintetizada de ese ritmo.',
    'Sputnik 1 sent pulses of about 0.3 seconds on 20.005 and 40.002 MHz. Radio amateurs around the world heard it: the day our species started speaking from outside the planet. What you hear here is a synthesized recreation of that rhythm.',
  ] as Bilingual,
  link: 'https://www.nasa.gov/history/sputnik/14.html',
  linkLabel: 'NASA History ↗',
} as const;
