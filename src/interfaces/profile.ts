/** Content contracts of the /perfil/ DOM (stations, stops, chapters, ticker). */

/** Rich headline: plain text plus <em> accents of the original markup. */
export type RichText = Array<string | { em: string }>;

export type ChapterId = 'perfil' | 'trayectoria' | 'proyectos' | 'habilidades' | 'liderazgo' | 'contacto';

export type IconName =
  | 'target'
  | 'compass'
  | 'spark'
  | 'rocket'
  | 'flag'
  | 'book'
  | 'layers'
  | 'signal'
  | 'code'
  | 'users'
  | 'ear'
  | 'grid'
  | 'planet';

/** In-page action of a chapter CTA: fly to a world, open another chapter or call Jorge. */
export type ChapterAction = `world:${number}` | `chapter:${ChapterId}` | 'walkie';

export type ChapterCta = { label: string; action: ChapterAction } | { label: string; href: string };

/** One card of a chapter. Whatever is not written is not painted. */
export interface ChapterItem {
  icon?: IconName;
  kicker?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  /** Capsules: [label, code suffix]. */
  caps?: [string, string][];
  cta?: ChapterCta;
  hidden?: boolean;
}

export interface Chapter {
  /** Two-digit number ("01"). */
  n: string;
  world: string;
  /** Accent colour. */
  acc: string;
  /** Huge outlined word behind the panel. */
  ghost: string;
  /** Yellow "provisional content" badge. */
  prov?: string;
  title: RichText;
  intro?: string;
  items: ChapterItem[];
}

/** Caption shown over a stop of the scroll track. */
export interface StopCaption {
  eyebrow: string;
  title: RichText;
  body: string;
  /** Resource transformation (from → to). */
  res?: [string, string];
  /** Accent colour. */
  acc: string;
  /** Opens this chapter, or 'decode9' for the jump to the Averno. */
  open: ChapterId | 'decode9';
  ctaLabel: string;
}

/** One of the 7 stations of the radio dial / stops of the journey. */
export interface Station {
  /** Label on the dial. */
  label: string;
  /** Accessible name on the dial. */
  ariaLabel: string;
  /** Section opened when clicking an already reached station. */
  sec: ChapterId | 'decode9';
  /** Horizontal position on the dial (%). */
  x: number;
  /** Label of the right-hand map. */
  mapLabel: string;
  /** Caption of the stop; absent for the contact stop (the walkie is the content). */
  caption?: StopCaption;
}

/** Ticker line of a world: [name, resource, result, phases]. */
export type WorldTick = [string, string, string, string];
