/**
 * Data contracts of the /perfil/ 3D scene (three-free, so data and React code can use them).
 * The three.js handles themselves live in `lib/three/profile` (see `ProfileScene`).
 */

/** A 0xRRGGBB colour, exactly as written in the original. */
export type HexColor = number;

export type Vec3Tuple = [number, number, number];

/** Prop makers available to a world (fábricas `mk` of the original). */
export type PropKind =
  | 'tree'
  | 'pine'
  | 'rack'
  | 'building'
  | 'antenna'
  | 'solar'
  | 'dome'
  | 'extractor'
  | 'turbine'
  | 'datacenter'
  | 'geoplant'
  | 'table'
  | 'crate'
  | 'crystal';

/**
 * One batch of props scattered over a world. Mirrors the original tuple
 * `[maker, count, pStart, pSpan, tmin, tmax, node, rev, hub]`.
 */
export interface WorldItemSpec {
  prop: PropKind;
  /** Window colour for `building` (the original `f.building(0x…)`); omitted → default warm windows. */
  windowColor?: HexColor;
  count: number;
  /** Terraform progress at which the batch starts to grow. */
  pStart: number;
  /** Spread of the start over the polar angle (or random for hubs). */
  pSpan: number;
  /** Polar angle range (radians from the north pole) where props are placed. */
  thetaMin: number;
  thetaMax: number;
  /** Takes part in the world's network arcs. */
  node: boolean;
  /** Starts visible and disappears as the world is terraformed (crates of the Colonia). */
  reverse?: boolean;
  /** Gathering point of the crew. */
  hub?: boolean;
}

/** A world Jorge terraforms (WORLDS of the original). */
export interface WorldConfig {
  name: string;
  pos: Vec3Tuple;
  /** Radius. */
  R: number;
  /** Phase offsets of the height noise. */
  off: [number, number, number, number, number];
  atmo: HexColor;
  /** Status labels of the four terraform phases. */
  phases: [string, string, string, string];
  barren: [HexColor, HexColor, HexColor];
  deep: HexColor;
  water: HexColor;
  edge: HexColor;
  main: [HexColor, HexColor, HexColor];
  /** Lava shown in the low areas while barren. */
  lava?: HexColor;
  /** Number of crew members (Colonia). */
  crew?: number;
  /** Shows the polar aurora ring (originally hard-wired to world index 2). */
  aurora?: boolean;
  items: WorldItemSpec[];
}

/** A non-terraformable body (mystery world, averno, sun). */
export interface BodyConfig {
  pos: Vec3Tuple;
  R: number;
}

export interface ScreenRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

/** Where the sun link goes on screen (sunHit of the original). */
export interface SunScreenState {
  /** On screen and not hidden behind a world. */
  visible: boolean;
  x: number;
  y: number;
  /** Diameter in CSS px. */
  size: number;
}
