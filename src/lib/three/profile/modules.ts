import * as THREE from 'three';
import type { JourneySegment } from './journey';
import type { ProfileScene } from './scene';

/**
 * Extension points of the profile runtime (phase 4c-2 plugs the station, night and walkie meshes here).
 *
 * The runtime owns the *poses*: it places `ctx.station` (Jorge's desk, scale 1.3) on the anchors and
 * along the orbit, and the walkie rig places its own group between the desk and the camera. Modules
 * only add meshes as children of those groups and animate them in `update(frame, ctx)`.
 *
 * Call order per frame: night.update → (terraform/autopilot) → profile.update → workstation.update
 * → effects → walkie.update → extensions[].update → DOM placement → render.
 */

/** DOM elements the stage positions every frame (bridge.refs). */
export interface StageElements {
  moonHit: HTMLElement | null;
  sunHit: HTMLElement | null;
  bubble: HTMLElement | null;
  walkieHint: HTMLElement | null;
  alarm: HTMLElement | null;
}

/** UI snapshot read every frame (bridge.getState()). */
export interface StageUiState {
  panelOpen: boolean;
  walkieOpen: boolean;
  walkieStrato: boolean;
  d9: { ok: boolean; asking: boolean; leaving: boolean };
  reduceMotion: boolean;
}

/** Raw readout for the dial/footer; the DOM formats it (setStatus of the original). */
export interface StageReadout {
  /** Current stop (0–last). */
  index: number;
  /** Seconds left before the autopilot flies on (0 = none). */
  countdown: number;
  flying: boolean;
  /** Terraform progress (0–1) of every world. */
  progress: number[];
  /** Terraform phase (0–3) of the current world (0 elsewhere). */
  phase: number;
  /** Night label while Jorge sleeps ("durmiendo · vuelve 7:00"), else null. */
  night: string | null;
}

/** What the runtime needs from the page (adapted from ProfileStageBridge by the hook). */
export interface StagePorts {
  elements: () => StageElements;
  getState: () => StageUiState;
  onStopProgress: (sp: number, settled: boolean) => void;
  onReadout: (readout: StageReadout) => void;
  onWalkieShown: () => void;
  openWalkie: (strato: boolean) => void;
  closeWalkie: () => void;
  onAsleep: (asleep: boolean) => void;
  askD9: () => void;
  leaveToD9: () => void;
  revokeD9: () => void;
  goTo: (index: number) => void;
}

/** Per-frame values shared with every module. */
export interface StageFrame {
  now: number;
  dt: number;
  /** Clock in seconds. */
  t: number;
  /** Scroll in stops (target). */
  sp: number;
  /** Smoothed scroll in stops (camera). */
  spS: number;
  seg: JourneySegment;
  /** Stop where scroll and camera rest, or -1. */
  settled: number;
  /** Weightlessness 0–1 during flights (fl). */
  fl: number;
  /** Jorge types at full speed (world not finished, or at the mystery). */
  working: boolean;
  atMystery: boolean;
  reduce: boolean;
  viewport: { width: number; height: number };
}

export interface StageContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  profile: ProfileScene;
  /** Jorge's desk group (scale 1.3), posed by the runtime. Children are disposed with the scene. */
  station: THREE.Group;
  ports: StagePorts;
  random: () => number;
}

export interface StageModule {
  update?: (frame: StageFrame, ctx: StageContext) => void;
  dispose?: () => void;
}

export type StageModuleFactory<M extends StageModule = StageModule> = (ctx: StageContext) => M;

/** Jorge, desk, monitor, CPU, keyboard and cables (L1736–1841). */
export interface WorkstationModule extends StageModule {
  /** World position the code sprites rise from (the monitor). */
  monitorOrigin: (out: THREE.Vector3) => THREE.Vector3;
  /** World position of a new thruster flame. */
  thrusterOrigin: (out: THREE.Vector3) => THREE.Vector3;
}

/** Night mode (L1842–2152): Argentina time, `?hora=`, `?sim=1`, alarm clock, sleeping Jorge. */
export interface NightModule extends StageModule {
  readonly active: boolean;
  /** Footer phase while active (NIGHT.label). */
  readonly label: string;
  start: (hour: number) => void;
  end: () => void;
}

export type WalkieMode = 'dock' | 'out' | 'open' | 'back';

/** 3D walkie (L2153–2202): docked on the desk, flies to the camera when the contact card opens. */
export interface WalkieModule extends StageModule {
  readonly mode: WalkieMode;
  /** Posed every frame; 4c-2 adds the meshes as children. */
  readonly group: THREE.Object3D;
  open: (strato: boolean) => void;
  close: () => void;
  /** Generous hit test at CSS px (x, y). Uses the camera of the last frame. */
  hits: (x: number, y: number) => boolean;
}

export interface StageModules {
  workstation?: StageModuleFactory<WorkstationModule>;
  night?: StageModuleFactory<NightModule>;
  walkie?: StageModuleFactory<WalkieModule>;
  /** Anything else (ambient props, debug overlays…), updated after the built-ins. */
  extensions?: StageModuleFactory[];
}

/* ---------- stubs (until 4c-2) ---------- */

const MONITOR = new THREE.Vector3(0, 0.47, -0.2235);

/** Desk without meshes: only the spawn points, at the same local offsets as the original. */
export const createWorkstationStub: StageModuleFactory<WorkstationModule> = ({ station, random }) => ({
  monitorOrigin: (out) => station.localToWorld(out.copy(MONITOR)),
  thrusterOrigin: (out) => station.localToWorld(out.set((random() - 0.5) * 0.08, 0.18, 0.3)),
});

/** Always day. */
export const createNightStub: StageModuleFactory<NightModule> = () => ({
  active: false,
  label: '',
  start: () => undefined,
  end: () => undefined,
});
