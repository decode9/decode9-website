/** Destinations of the terminal (original window.D9_CONFIG). Relative to /decode9/. */
export const TERMINAL_URLS = {
  /** Jorge's professional profile (blue pill). */
  jorgeUrl: '../perfil/',
  /** Entry page with the pills; the Exit button returns here. */
  portalUrl: '../',
  /** Public address shared on social networks. */
  shareBase: 'https://decode9.codes/decode9/',
  /** Mobile transmitter (red pill from a phone). */
  mobileUrl: 'movil/',
} as const;

/** localStorage keys of the terminal. */
export const TERMINAL_STORAGE = {
  lang: 'd9crt-lang',
  crt: 'd9crt-fx',
  mute: 'd9crt-mute',
  /** Legacy key: removed on load. */
  legacyUser: 'd9crt-user',
} as const;
