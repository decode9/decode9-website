/** Data of the entry page «Elige tu lado» (/), ported from jorge/index.html. */

export type EntrySide = 'red' | 'blue';

/** Destinations (absolute, trailing slash: next.config uses trailingSlash). */
export const ENTRY_ROUTES = {
  decode9: '/decode9/',
  decode9Mobile: '/decode9/movil/',
  profile: '/perfil/',
} as const;

/** Files fetched on the exit screen so the destination opens fast (bytes are measured for the bar). */
export const ENTRY_PRELOAD = {
  red: ['/decode9/', '/decode9/img/d9-cut.webp', '/decode9/img/d9-lockup.webp'],
  redMobile: ['/decode9/movil/'],
  // The original also fetched perfil/assets/three.min.js; three now ships inside the hashed Next chunks.
  blue: ['/perfil/'],
} as const;

/** Face frames: from looking left (red) to laughing towards the right (blue). There is no f09. */
export const FACE_FRAMES = ['f00', 'f01', 'f02', 'f03', 'f04', 'f05', 'f06', 'f07', 'f08', 'f10', 'f11', 'f12'] as const;
export const FACE_FRAME_URL = (name: string): string => `/entrada/frames/${name}.webp`;
/** Index of the frontal frame. */
export const FACE_CENTER = 3;
/** Where the head sits in each frame (0–1 of the width); on phones it is corrected to keep Jorge centred. */
export const FACE_HEADX = [0.502, 0.519, 0.388, 0.491, 0.478, 0.45, 0.476, 0.456, 0.448, 0.471, 0.472, 0.44] as const;

/** Terminal log shown while warping to decode9. */
export const WARP_LOG = ['> conectando con decode9', '> abriendo los archivos', '> descifrando señal', '> acceso concedido'] as const;

export const ENTRY_TIMING = {
  /** Minimum time the boot overlay stays (0 with reduced motion). */
  minBootMs: 700,
  /** Copy fade before the warp screen appears. */
  leaveDelayMs: 420,
  /** Warp: preload gives up after this. */
  preloadTimeoutMs: 8000,
  /** Warp: minimum visible time, plus a final hold. */
  warpMinMs: 900,
  warpHoldMs: 250,
  /** Warp: animated number refresh. */
  warpTickMs: 50,
  toastMs: 2600,
  tiltNoticeMs: 3200,
  /** Phones without gyroscope readings fall back to finger control after this. */
  tiltFallbackMs: 4000,
} as const;

/** Media query of the phone layout. */
export const ENTRY_MOBILE_MQ = '(max-aspect-ratio:9/10)';

export interface EntryDestination {
  url: string;
  files: readonly string[];
}

/**
 * Where each side leads. Red goes to the mobile transmitter on phones unless ?escritorio=1,
 * which is forwarded to the terminal so it does not bounce back to /decode9/movil/.
 */
export const resolveDestination = (
  side: EntrySide,
  { isMobile, forceDesktop }: { isMobile: boolean; forceDesktop: boolean },
): EntryDestination => {
  if (side === 'blue') return { url: ENTRY_ROUTES.profile, files: ENTRY_PRELOAD.blue };
  if (isMobile && !forceDesktop) return { url: ENTRY_ROUTES.decode9Mobile, files: ENTRY_PRELOAD.redMobile };
  return { url: ENTRY_ROUTES.decode9 + (forceDesktop ? '?escritorio=1' : ''), files: ENTRY_PRELOAD.red };
};
