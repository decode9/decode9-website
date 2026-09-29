/** Motion design tokens: every timeline in the site draws from these. */
export const ease = {
  reveal: 'expo.out',
  camera: 'power3.inOut',
  soft: 'power2.out',
  snap: 'back.out(1.6)',
} as const;

export const duration = {
  fast: 0.35,
  base: 0.7,
  slow: 1.2,
  camera: 1.8,
  morph: 2.4,
} as const;

export const stagger = {
  glyph: 0.03,
  item: 0.07,
  line: 0.12,
} as const;

/** Glyph set for the "decode" scramble: code-ish, never emoji. */
export const scrambleChars = '01<>/{}[]#$%&*+=?ABCDEFXYZ';

/** The horizontal tour. Keep in sync with the `h` screen in tailwind.config.ts. */
export const horizontalQuery =
  '(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';
export const motionQuery = '(prefers-reduced-motion: no-preference)';
