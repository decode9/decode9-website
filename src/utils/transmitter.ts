/*
 * Pure helpers of the mobile transmitter (/decode9/movil/). No DOM, no Web Audio: unit-tested.
 */

const ALIAS_UNSAFE = /[<>"'`]/g;
export const ALIAS_MAX = 24;

/** `?alias=` from the terminal QR: strips HTML-ish characters, trims and cuts to 24 chars. */
export const sanitizeAlias = (raw: string | null | undefined): string =>
  (raw ?? '').replace(ALIAS_UNSAFE, '').trim().slice(0, ALIAS_MAX);

/** Babble syllables of a word: one per ~2.6 letters, between 1 and 4. */
export const syllablesInWord = (word: string): number =>
  Math.max(1, Math.min(4, Math.round(word.replace(/[^a-záéíóúñ]/gi, '').length / 2.6)));

/** Words ending a sentence get a longer pause (and maybe a laugh). */
export const isSentenceEnd = (word: string): boolean => /[.!?…—:]$/.test(word);

const pad2 = (value: number): string => String(value).padStart(2, '0');

/** "HH" / "MM" of the lock screen clock. */
export const formatLockTime = (date: Date): { hours: string; minutes: string } => ({
  hours: pad2(date.getHours()),
  minutes: pad2(date.getMinutes()),
});

/** "MIÉ · 11 NOV 2026" using the given weekday/month abbreviations. */
export const formatLockDate = (date: Date, weekdays: readonly string[], months: readonly string[]): string =>
  `${weekdays[date.getDay()]} · ${pad2(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;

/** Call timer "MM:SS". */
export const formatElapsed = (seconds: number): string => `${pad2(Math.floor(seconds / 60))}:${pad2(seconds % 60)}`;

/** Media time "MM:SS" ("00:00" for NaN/Infinity). */
export const formatMediaTime = (seconds: number): string =>
  Number.isFinite(seconds) ? `${pad2(Math.floor(seconds / 60))}:${pad2(Math.floor(seconds % 60))}` : '00:00';

/** SVG path data of the floating frame marks (corners + 3 top/bottom and 4 side ticks) for a w×h box. */
export const buildFrameTicks = (w: number, h: number): string[] => {
  if (!w) return [];
  const corners = `M0 14V0H14M${w - 14} 0H${w}V14M0 ${h - 14}V${h}H14M${w - 14} ${h}H${w}V${h - 14}`;
  const horizontal = [1, 2, 3].map((i) => {
    const x = (w * i) / 4;
    return `M${x - 5} 0H${x + 5}M${x} 0V6M${x - 5} ${h}H${x + 5}M${x} ${h}V${h - 6}`;
  });
  const vertical = [1, 2, 3, 4].map((i) => {
    const y = (h * i) / 5;
    return `M0 ${y}H6M0 ${y - 4}V${y + 4}M${w} ${y}H${w - 6}M${w} ${y - 4}V${y + 4}`;
  });
  return [corners, ...horizontal, ...vertical];
};

export type TransmitterStatus = 'INTERFERENCIA' | 'HABLANDO' | 'TRANSMITIENDO' | 'ESCUCHANDO';

/** Status shown in ESTADO and in the top bar. */
export const transmitterStatus = ({
  lost,
  speaking,
  mediaOn,
}: {
  lost: number;
  speaking: boolean;
  mediaOn: boolean;
}): TransmitterStatus => {
  if (lost > 0.5) return 'INTERFERENCIA';
  if (speaking) return 'HABLANDO';
  if (mediaOn) return 'TRANSMITIENDO';
  return 'ESCUCHANDO';
};

/** Total distortion 0–1 from shaking, lost signal and talking. */
export const distortionLevel = (shake: number, lost: number, talking: boolean): number =>
  Math.min(1, shake + lost + (talking ? 0.04 : 0));

/** Lit bars (0–5) of the SEÑAL meter. */
export const signalBars = (distortion: number, lost: number): number =>
  Math.max(0, Math.round(5 - distortion * 5 - lost * 4));

/** Milliseconds per typed character so the text roughly follows the voice. */
export const typingDelay = (durationSeconds: number, length: number): number =>
  Math.max(14, Math.min(42, ((durationSeconds * 1000) / Math.max(1, length)) * 0.9));

/** Duration (s) of a transcript line typed without voice. */
export const silentLineDuration = (text: string): number => 0.6 + text.length * 0.03;

/** Points of a regular hexagon of radius r (SVG `points`). */
export const hexPoints = (r: number): string =>
  [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i;
      return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');

export interface DialTick {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  major: boolean;
}

/** Graduation of the dial ring: every 2° from -120° to 120°, a major tick every 12°. */
export const buildDialTicks = (cx: number, cy: number, inner = 238, outerMajor = 256, outerMinor = 248): DialTick[] =>
  Array.from({ length: 121 }, (_, i) => -120 + i * 2).map((deg) => {
    const a = (deg * Math.PI) / 180;
    const major = deg % 12 === 0;
    const outer = major ? outerMajor : outerMinor;
    return {
      x1: (cx + inner * Math.sin(a)).toFixed(1),
      y1: (cy - inner * Math.cos(a)).toFixed(1),
      x2: (cx + outer * Math.sin(a)).toFixed(1),
      y2: (cy - outer * Math.cos(a)).toFixed(1),
      major,
    };
  });

/** Position of station `index` on the dial ring (degrees step between stations). */
export const stationPosition = (index: number, step: number, cx: number, cy: number, radius = 202): { x: string; y: string } => {
  const a = (index * step * Math.PI) / 180;
  return { x: (cx + radius * Math.sin(a)).toFixed(1), y: (cy - radius * Math.cos(a)).toFixed(1) };
};

/** Dragged dial angle, limited to the stations range plus a 10° overshoot. */
export const clampDialAngle = (angle: number, stationCount: number, step: number): number =>
  Math.max(-(stationCount - 1) * step - 10, Math.min(10, angle));

/** Station under the needle for a dial angle (may be out of range: callers clamp). */
export const stationAtAngle = (angle: number, step: number): number => Math.round(-angle / step) || 0;

export const clampStation = (index: number, stationCount: number): number => Math.max(0, Math.min(stationCount - 1, index));

/** Tap on the dial background: left third goes back, right third forward. */
export const stationFromTap = (relativeX: number, current: number): number => {
  if (relativeX < 0.36) return current - 1;
  if (relativeX > 0.64) return current + 1;
  return current;
};

/** Target wobble (deg) of the dial from the device tilt, with a ±2° dead zone. */
export const dialWobbleTarget = (tilt: number, reduceMotion: boolean): number => {
  if (reduceMotion || Math.abs(tilt) < 2) return 0;
  return (tilt - Math.sign(tilt) * 2) * 0.07;
};

/** CSS custom properties of a glitching portrait for distortion `k`. */
export const portraitGlitch = (k: number, reduceMotion: boolean, random: () => number): Record<string, string> => {
  const vars: Record<string, string> = {
    '--j': `${(reduceMotion ? 0 : (random() - 0.5) * k * 14).toFixed(1)}px`,
    '--gx': `${(reduceMotion ? 0 : (random() - 0.5) * k * 26).toFixed(1)}px`,
    '--no': (reduceMotion ? 0 : Math.min(0.85, k * 0.9)).toFixed(2),
  };
  if (random() < 0.3) {
    const q = random() * 80;
    const b = random() * 80;
    vars['--c1t'] = `${q}%`;
    vars['--c1b'] = `${Math.max(0, 82 - q)}%`;
    vars['--c2t'] = `${b}%`;
    vars['--c2b'] = `${Math.max(0, 84 - b)}%`;
    vars['--bt'] = `${random() * 90}%`;
  }
  return vars;
};
