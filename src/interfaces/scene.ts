export type ShapeId =
  'scatter' | 'isotype' | 'helix' | 'constellation' | 'grid' | 'monolith' | 'sphere' | 'path' | 'portal';

export type CameraPoseId = 'loader' | 'hero' | 'side' | 'orbit' | 'low' | 'close' | 'wide' | 'travel' | 'finale';

export type QualityTier = 'high' | 'medium' | 'low' | 'off';

export interface QualitySettings {
  tier: QualityTier;
  particles: number;
  maxDpr: number;
  bloom: boolean;
}

/** Declarative description of what the stage should show. */
export interface SceneState {
  shape: ShapeId;
  camera: CameraPoseId;
  /** Accent colour (hex) tinting particles and bloom. */
  accent: string;
  /** Solid isotype visibility, 0–1. */
  solid: number;
  /** 0–1 multiplier keeping the stage quiet behind dense content. */
  intensity: number;
}

export interface SceneSnapshot extends SceneState {
  /** Index of the highlighted element within the shape (e.g. a service node). */
  focus: number | null;
  /** The agent is waiting for a reply. */
  thinking: boolean;
  /**
   * Preloader progress (0–1) while the visit boots: the mark assembles centre-stage
   * with it. `null` once the tour has started.
   */
  loading: number | null;
}

export interface SceneStore {
  get: () => SceneSnapshot;
  set: (patch: Partial<SceneSnapshot>) => void;
  subscribe: (listener: (snapshot: SceneSnapshot, previous: SceneSnapshot) => void) => () => void;
}

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  /** Horizontal offset of the subject on wide screens, in world units. */
  shiftX: number;
}
