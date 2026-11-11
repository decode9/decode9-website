import type { Analytics } from './analytics';
import type { PostSource } from './post';
import type { SignalGateway } from './signal';

/** Text of the decode9 terminal in both languages: [español, english]. */
export type Bilingual = readonly [es: string, en: string];

export type TerminalLang = 'es' | 'en';

/** Ids of the terminal screens (main menu entries, also the URL hash). */
export type TerminalScreenId =
  | 'home'
  | 'manifiesto'
  | 'origen'
  | 'lab'
  | 'codice'
  | 'archivo'
  | 'canal'
  | 'enlace'
  | 'tx';

export interface TerminalMenuItem {
  id: TerminalScreenId;
  /** Two-digit number shown next to the entry. */
  n: string;
  t: Bilingual;
  /** Short status line (kept from the original data). */
  st: Bilingual;
}

/** Where the wire logo and the HUD mini-map point for a screen: x, y (0..1 of the viewport) and scale. */
export interface WireTarget {
  x: number;
  y: number;
  s: number;
}

/** A closed polygon of the decode9 logo, in the 1024×1137 logo space. */
export type LogoPolygon = ReadonlyArray<readonly [number, number]>;

export interface LogoPolygons {
  /** Red pieces. */
  r: readonly LogoPolygon[];
  /** Grey pieces. */
  g: readonly LogoPolygon[];
}

/* ---------- Content screens (phase 2b) ---------- */

/** Key of a line icon in data/terminal/icons (ICONS). */
export type TerminalIcon =
  | 'eye'
  | 'ask'
  | 'bulb'
  | 'flask'
  | 'target'
  | 'cycle'
  | 'shield'
  | 'flame'
  | 'agent'
  | 'chip'
  | 'lock'
  | 'auto'
  | 'lens'
  | 'cube'
  | 'id'
  | 'radio'
  | 'doc'
  | 'video'
  | 'audio';

/** A step of the scientific method (Manifiesto · Método). */
export interface MethodStep {
  ic: TerminalIcon;
  t: Bilingual;
  d: Bilingual;
}

/** "What you see" vs. what it is (Manifiesto · Lo que ves). */
export interface MythEntry {
  ic: TerminalIcon;
  /** What you see (crossed out). */
  s: Bilingual;
  t: Bilingual;
  d: Bilingual;
  /** Conclusion tag. */
  k: Bilingual;
}

/** A quote about knowledge (Manifiesto · Conocimiento). */
export interface KnowledgeQuote {
  author: string;
  /** Source or year. */
  src: Bilingual;
  quote: Bilingual;
  gloss: Bilingual;
}

/** A log of the origin file; `img` is the base name of /decode9/img/<img>.jpg. */
export interface OriginLog {
  img: string;
  t: Bilingual;
  d: Bilingual;
}

/** A research branch of the Lab; `img` is /decode9/img/cut-<img>.webp. */
export interface ResearchBranch {
  ic: TerminalIcon;
  img: string;
  n: Bilingual;
  /** Short name for the slot. */
  sh: Bilingual;
  br: Bilingual;
  d: Bilingual;
  /** Chips: plain string (same in both languages) or [es, en]. */
  t: ReadonlyArray<string | Bilingual>;
  /** Progress pips (0..5). */
  pv: number;
}

/** A character-sheet attribute of the Lab (value 0..10, optional badge). */
export interface SheetAttribute {
  t: Bilingual;
  v: number;
  badge?: string;
}

/** Codex entry: a species ('sp') or a place/event ('pl'); `img` is /decode9/img/<img>.jpg. */
export interface CodexEntry {
  img: string;
  k: 'sp' | 'pl';
  kind: Bilingual;
  nm: Bilingual;
  d: Bilingual;
  /** Trait. */
  a: Bilingual;
  /** Contribution. */
  b: Bilingual;
}

/** A received signal of the Archive (an influence). */
export interface ArchiveSignal {
  n: string;
  k: Bilingual;
  /** Frequency label (MHz). */
  f: string;
  /** Signal strength 0..5. */
  s: number;
  d: Bilingual;
}

/** A link of the share row (original shareHTML). */
export interface ShareTarget {
  id: 'x' | 'fb' | 'in' | 'wa' | 'tg';
  label: string;
  /** Builds the network URL from the encoded page URL and encoded title. */
  href: (encodedUrl: string, encodedTitle: string) => string;
}

/* ---------- Canal, Enlace y transmisor (phase 2c) ---------- */

/** Analyser over a playing <audio>/<video> (original setupAn in mountMedia). Created on first play. */
export interface MediaMeter {
  /** Resumes the audio context (browsers start it suspended until a gesture). */
  resume: () => void;
  /** Current frequency bins (0–255) or null when the analyser could not be built. */
  levels: () => Uint8Array | null;
  dispose: () => void;
}

/**
 * Infrastructure the content screens use, injected by the composition root (components/Shell) through
 * ScreenContext.services. Components never import lib/ directly.
 */
export interface TerminalServices {
  /** Publications of the «Canal» (data/posts today). */
  posts: PostSource;
  /** Contact form of «Enlace» → POST /senal. */
  signal: SignalGateway;
  /** Paints the styled transmitter QR on `canvas`; false when it could not be drawn. */
  drawQr: (canvas: HTMLCanvasElement, text: string) => boolean;
  /** Builds the analyser of a media element (one per element). */
  createMediaMeter: (media: HTMLMediaElement) => MediaMeter | null;
  /** Records visitor actions (`post_open`). */
  analytics: Analytics;
}
