import type { PostType } from '@/interfaces/post';
import type { Bilingual } from '@/interfaces/terminal';

/* ---------- Canal · publicaciones (original OPENERS.posts, PI, PT, PTABS) ---------- */

export const POST_TYPE_LABEL: Record<PostType, Bilingual> = {
  doc: ['Bitácora', 'Log'],
  video: ['Transmisión', 'Broadcast'],
  audio: ['Podcast', 'Podcast'],
};

export type PostTabKey = 'all' | PostType;

export const POST_TABS: ReadonlyArray<{ key: PostTabKey; t: Bilingual }> = [
  { key: 'all', t: ['Todo', 'All'] },
  { key: 'doc', t: ['Bitácora', 'Log'] },
  { key: 'video', t: ['Transmisión', 'Broadcast'] },
  { key: 'audio', t: ['Podcast', 'Podcast'] },
];

/** Tiles per page of the post grid. */
export const POSTS_PER_PAGE = 6;

export const CHANNEL_TEXT = {
  listTitle: ['Canal · publicaciones', 'Channel · posts'] as Bilingual,
  infoTitle: ['Señal del canal', 'Channel signal'] as Bilingual,
  info: [
    'Bitácoras, transmisiones y podcasts desde el laboratorio. Abre uno: cada archivo llega en su propia ventana.',
    'Logs, broadcasts and podcasts from the lab. Open one: each file arrives in its own window.',
  ] as Bilingual,
  tuning: ['Sintonizando el canal…', 'Tuning the channel…'] as Bilingual,
  empty: ['Aún no hay publicaciones de este tipo.', 'No posts of this type yet.'] as Bilingual,
  files: ['archivos', 'files'] as Bilingual,
  prev: 'Anterior / Previous',
  next: 'Siguiente / Next',
  source: ['Fuente', 'Source'] as Bilingual,
  viewOriginal: ['Ver original', 'View original'] as Bilingual,
  sample: {
    video: [
      'Muestra: este fragmento se usa para todas las transmisiones mientras se conectan los archivos reales.',
      'Sample: this clip stands in for every broadcast until the real files are connected.',
    ] as Bilingual,
    audio: [
      'Muestra: este fragmento se usa para todas las emisiones del podcast mientras se conectan los archivos reales.',
      'Sample: this clip stands in for every podcast episode until the real files are connected.',
    ] as Bilingual,
  },
  rec: ['Transmisión', 'Broadcast'] as Bilingual,
  play: 'Reproducir / Play',
  pause: 'Pausar / Pause',
  progress: 'Progreso / Progress',
  mute: 'Silenciar / Mute',
  unmute: 'Activar sonido / Unmute',
  fullscreen: 'Pantalla completa / Fullscreen',
} as const;

/** Hash every post shares (the original shared the screen, not the post). */
export const POST_SHARE_HASH = 'canal';

/* ---------- Iniciar transmisor · QR (original OPENERS.qr) ---------- */

export const QR_TEXT = {
  title: ['Iniciar transmisor', 'Start transmitter'] as Bilingual,
  field: ['Enlace de campo · 147.9', 'Field link · 147.9'] as Bilingual,
  canvasLabel: 'Código QR del transmisor',
  linked: ['Enlazado a', 'Linked to'] as Bilingual,
  scan: [
    'Escanéalo con la cámara de tu celular: el transmisor se enciende allá con tu nombre de investigador.',
    'Scan it with your phone camera: the transmitter turns on there with your researcher name.',
  ] as Bilingual,
  copy: ['Copiar enlace', 'Copy link'] as Bilingual,
} as const;

/** Longest alias carried by the QR link (original d9TxUrl slice(0,24)). */
export const QR_ALIAS_MAX = 24;

/* ---------- Enlace · transmisor y formulario (original OPENERS.canal + initCanal) ---------- */

export type TxLineTone = '' | 'c' | 'ok';
export interface TxLine {
  tone: TxLineTone;
  t: Bilingual;
}

export const LINK_TEXT = {
  radioTitle: ['Transmisor · 147.9', 'Transmitter · 147.9'] as Bilingual,
  direct: ['Canal directo', 'Direct channel'] as Bilingual,
  freq: '147.9',
  band: 'MHZ · AV-09',
  formTitle: ['¿Quieres charlar con decode9?', 'Want to talk with decode9?'] as Bilingual,
  kicker: ['Trae tu sistema imposible', 'Bring your impossible system'] as Bilingual,
  intro: [
    'Deja tu alias y tu correo. Si hay algo que investigar juntos, te escribe.',
    'Leave your alias and email. If there’s something to research together, he’ll write to you.',
  ] as Bilingual,
  alias: 'Alias',
  aliasPlaceholder: 'neo_404',
  email: ['Correo', 'Email'] as Bilingual,
  emailPlaceholder: 'tu@correo.com',
  topics: ['¿De qué quieres hablar?', 'What do you want to talk about?'] as Bilingual,
  message: ['Mensaje (opcional)', 'Message (optional)'] as Bilingual,
  send: ['Transmitir', 'Transmit'] as Bilingual,
} as const;

/** Topic checkboxes: `value` is what the API receives. */
export const LINK_TOPICS: ReadonlyArray<{ value: string; t: Bilingual }> = [
  { value: 'IA', t: ['IA y agentes', 'AI & agents'] },
  { value: 'Seguridad', t: ['Seguridad', 'Security'] },
  { value: 'Arquitectura', t: ['Arquitectura', 'Architecture'] },
  { value: 'Otra cosa', t: ['Otra cosa', 'Something else'] },
];

/** Field limits of the desktop form (original maxlength + slice). */
export const LINK_LIMITS = { alias: 40, email: 120, msg: 500 } as const;

/** Bars of the dial. */
export const DIAL_BARS = 32;

/** Status line under the button. */
export const LINK_NOTES = {
  idle: ['Solo Jorge verá tu alias y tu correo.', 'Only Jorge will see your alias and email.'] as Bilingual,
  noAlias: ['Escribe un alias para que sepa cómo llamarte.', 'Add an alias so he knows what to call you.'] as Bilingual,
  badEmail: [
    'Revisa el correo: debe tener el formato nombre@dominio.com.',
    'Check the email: it should look like name@domain.com.',
  ] as Bilingual,
  sending: ['Transmitiendo…', 'Transmitting…'] as Bilingual,
  done: ['Transmisión completa.', 'Transmission complete.'] as Bilingual,
  unavailable: [
    'Este canal no está disponible en esta vista. Abre la página con tu cuenta para transmitir.',
    'This channel isn’t available in this view. Open the page signed in to transmit.',
  ] as Bilingual,
  failed: ['No se pudo transmitir. Inténtalo de nuevo en un momento.', 'The transmission failed. Try again in a moment.'] as Bilingual,
} as const;

/** Transmitter log lines (original txlog calls). */
export const TX_LOG = {
  open: [
    { tone: '', t: ['canal 147.9 abierto', 'channel 147.9 open'] },
    { tone: '', t: ['esperando señal del visitante…', 'waiting for visitor signal…'] },
  ] as TxLine[],
  sending: [
    { tone: 'c', t: ['cifrando paquete…', 'encrypting packet…'] },
    { tone: 'c', t: ['enviando a AV-09…', 'sending to AV-09…'] },
  ] as TxLine[],
  received: [
    { tone: 'ok', t: ['señal recibida ✓', 'signal received ✓'] },
    { tone: '', t: ['si hay algo que investigar juntos, decode9 te escribe.', 'if there’s something to research together, decode9 will write to you.'] },
  ] as TxLine[],
  cancelled: [{ tone: '', t: ['sin enlace: transmisión cancelada', 'no link: transmission cancelled'] }] as TxLine[],
} as const;

/** Delay between log lines and before the success lines (ms). */
export const TX_TIMING = { line: 260, success: 600 } as const;
