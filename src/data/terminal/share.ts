import type { Bilingual, ShareTarget } from '@/interfaces/terminal';

/** Share row of detail windows (original shareHTML / SI). Icons are inner SVG markup, viewBox 0 0 24 24. */
export const SHARE_TARGETS: readonly ShareTarget[] = [
  { id: 'x', label: 'X', href: (u, t) => `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
  { id: 'fb', label: 'Facebook', href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { id: 'in', label: 'LinkedIn', href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  { id: 'wa', label: 'WhatsApp', href: (u, t) => `https://wa.me/?text=${t}%20${u}` },
  { id: 'tg', label: 'Telegram', href: (u, t) => `https://t.me/share/url?url=${u}&text=${t}` },
];

export const SHARE_ICONS: Record<ShareTarget['id'] | 'ln', string> = {
  x: '<path d="M4 4l16 16M20 4L4 20"/>',
  fb: '<path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
  in: '<rect x="3" y="3" width="18" height="18"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7"/>',
  wa: '<path d="M4 20l1.5-4A8 8 0 1112 20a8 8 0 01-4-1z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/>',
  tg: '<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/><path d="M9 13l8-6"/>',
  ln: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
};

export const SHARE_TEXT = {
  share: ['Compartir', 'Share'] as Bilingual,
  copy: 'Copiar enlace / Copy link',
} as const;
