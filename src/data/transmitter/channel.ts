import type { Post } from '@/interfaces/post';

/** Base of the shared links (original D9M.shareBase, fixed to the public URL). */
export const SHARE_BASE = 'https://decode9.codes/decode9/movil/';
/** "Conocer al investigador" on the off-air screen (original D9M.jorgeUrl). */
export const PROFILE_URL = '/perfil/';

/** Default media of a post without src/poster. */
export interface ChannelMediaDefaults {
  video: string;
  poster: string;
  audio: string;
}

interface ChannelBase {
  id: string;
  /** Kicker: the part of the title before " · " ('' when none). */
  kicker: string;
  /** Heading: the rest of the title. */
  heading: string;
}

export interface ChannelVideo extends ChannelBase {
  description: string;
  dur: string;
  src: string;
  poster: string;
}

export interface ChannelAudio extends ChannelBase {
  dur: string;
  src: string;
}

export interface ChannelDoc extends ChannelBase {
  paragraphs: string[];
  minutes: number;
}

export interface ChannelContent {
  videos: ChannelVideo[];
  audios: ChannelAudio[];
  docs: ChannelDoc[];
}

/** "Bitácora 001 · Título" → { kicker:'Bitácora 001', heading:'Título' } (original splitT). */
export const splitTitle = (title: string): { kicker: string; heading: string } => {
  const parts = title.split(' · ');
  return parts.length > 1 ? { kicker: parts[0], heading: parts.slice(1).join(' · ') } : { kicker: '', heading: title };
};

/** Reading time: 200 words per minute, at least 1. */
export const readingMinutes = (body: string): number => Math.max(1, Math.round(body.split(/\s+/).length / 200));

/** Newest first (by ISO `at`), like the original posts loader. */
export const sortPosts = (posts: readonly Post[]): Post[] =>
  posts.filter((p) => p.type && p.title).sort((x, y) => String(y.at || '').localeCompare(String(x.at || '')));

/** Splits the posts into the three lists of the transmitter (original render()). */
export const buildChannel = (posts: readonly Post[], media: ChannelMediaDefaults): ChannelContent => {
  const sorted = sortPosts(posts);
  const base = (p: Post) => ({ id: p.id, ...splitTitle(p.title) });
  return {
    videos: sorted
      .filter((p) => p.type === 'video')
      .map((p) => ({ ...base(p), description: p.body || '', dur: p.dur || '', src: p.src || media.video, poster: p.poster || media.poster })),
    audios: sorted.filter((p) => p.type === 'audio').map((p) => ({ ...base(p), dur: p.dur || '', src: p.src || media.audio })),
    docs: sorted
      .filter((p) => p.type === 'doc')
      .map((p) => ({ ...base(p), paragraphs: String(p.body || '').split(/\n\s*\n/).filter(Boolean), minutes: readingMinutes(String(p.body || '')) })),
  };
};

/** Texts of the contact pane (CONTACTO). */
export const CONTACT_TEXT = {
  invalid: 'FALTA UNA FRECUENCIA: ALIAS Y CORREO O WHATSAPP',
  failed: 'LA SEÑAL NO SALIÓ. INTÉNTALO DE NUEVO EN UN MOMENTO',
  morse: '· · · — — — · · ·',
  sendingMorse: '· · · — — —',
  spoken: 'Te tengo. Tu señal ya está en la mesa del investigador. Jorge te escribe. Mientras tanto, gira el dial. Cambio.',
} as const;

/** Beep times (s) of the SOS morse and the vibration pattern while a signal goes out. */
export const SOS_BEEPS: readonly number[] = [0, 0.12, 0.24, 0.5, 0.74, 0.98, 1.24, 1.36, 1.48];
export const SOS_VIBRATION: readonly number[] = [80, 60, 80, 60, 80, 120, 240, 60, 240, 60, 240, 120, 80, 60, 80, 60, 80];
/** Minimum time the "TRANSMITIENDO" animation lasts (ms). */
export const SOS_MIN_MS = 1900;
