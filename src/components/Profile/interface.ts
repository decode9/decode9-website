import type { RefObject } from 'react';
import type { SoundSource } from '@/interfaces/audio';
import type { NewsItem, NewsSource } from '@/interfaces/news';
import type { ChapterId } from '@/interfaces/profile';
import type { KeyValueStorage } from '@/interfaces/storage';
import type { WalkieGateway } from '@/interfaces/walkie';

/** Props of <Profile />. */
export type ProfileProps = Record<string, never>;

/** Infrastructure injected by the composition root (Profile/index.tsx). */
export interface ProfileDeps {
  walkieGateway: WalkieGateway;
  newsSource: NewsSource;
  createSound: () => SoundSource;
  /** Downloads decode9 while the warp log shows the real progress (0–1). */
  preload: (files: readonly string[], onProgress: (p: number) => void) => Promise<void>;
  storage: KeyValueStorage;
}

/** Readout of the dial + footer for the current stop (setStatus of the original). */
export interface StationStatus {
  /** Current stop (0–6). */
  index: number;
  /** "Origen", "Por descubrir", "Averno"… */
  name: string;
  /** "terraformando · Suelo", "en órbita", "esperando tu idea"… */
  phase: string;
  /** "37%", "?" or "d9". */
  pct: string;
  /** Width of the footer progress bar (0–100). */
  progress: number;
  replayDisabled: boolean;
  /** Worlds fully terraformed (map dots in green). Length 5. */
  done: boolean[];
}

/** Walkie as seen by the DOM: requested open (the 3D walkie flies to the camera) and shown (bubble on). */
export interface WalkieView {
  open: boolean;
  /** Launched from the contact stop: rises to the stratosphere first (2 s instead of 1 s). */
  strato: boolean;
  /** The 3D walkie arrived: the bubble is visible. */
  shown: boolean;
}

/** Snapshot the stage reads every frame (getState()). */
export interface ProfileUiSnapshot {
  panelOpen: boolean;
  aboutOpen: boolean;
  walkie: WalkieView;
  d9: { ok: boolean; asking: boolean; leaving: boolean };
  asleep: boolean;
  reduceMotion: boolean;
}

/** Imperative API the stage registers so the DOM can drive the 3D scene. */
export interface ProfileStageApi {
  /** ↻ button: terraform world `index` again (p = reduce ? 1 : 0). */
  resetWorld: (index: number) => void;
  /** "Volver a recorrer la galaxia": reset every world (the DOM then scrolls to stop 0). */
  resetAll: () => void;
  /** Night mode simulator (`?sim=1`): start the night at `hour` / end it. */
  startNight: (hour: number) => void;
  endNight: () => void;
}

/**
 * Contract between the DOM (4a) and the 3D stage (4b/4c). The object is stable for the whole life of
 * the page: read state with getState() inside the render loop, call the callbacks freely.
 *
 * Elements positioned per frame by the stage (set style.left/top/width/height directly):
 *  - refs.moonHit: the About button; the stage reads its rect to place the 3D moon (placeMoon).
 *  - refs.sunHit:  link to theempire.tech over the sun; toggle `hidden` and set left/top/width/height.
 *  - refs.bubble:  walkie card; set left/top and the CSS vars --ox/--oy (transform origin) while shown.
 *  - refs.walkieHint: "Toca el walkie…" pill; set `data-on` ('' = visible, absent = hidden) + left/top.
 *  - refs.alarm:   night alarm clock; toggle `hidden`, `data-on` and left/top.
 */
export interface ProfileStageBridge {
  refs: {
    moonHit: RefObject<HTMLButtonElement>;
    sunHit: RefObject<HTMLAnchorElement>;
    bubble: RefObject<HTMLDivElement>;
    walkieHint: RefObject<HTMLDivElement>;
    alarm: RefObject<HTMLDivElement>;
  };
  getState: () => ProfileUiSnapshot;
  /** Call once the scene runs (null on dispose). Turns off the DOM fallbacks (scroll dial, walkie timer). */
  registerApi: (api: ProfileStageApi | null) => void;
  /** Every frame: scroll position in stops (0–6, fractional) and whether the camera settled. */
  onStopProgress: (sp: number, settled: boolean) => void;
  /** When the readout changes (the stage dedupes like stKey). */
  onStatus: (status: StationStatus) => void;
  /** The 3D walkie finished flying to the camera: show the bubble. */
  onWalkieShown: () => void;
  /** Click on the 3D walkie (strato=false) or arrival at the contact stop (strato=true). */
  openWalkie: (strato?: boolean) => void;
  /** Click on the canvas away from the walkie, or flying away from the contact stop. */
  closeWalkie: () => void;
  /** Night mode put Jorge to sleep / woke him up (body[data-asleep], ambient sound gating). */
  onAsleep: (asleep: boolean) => void;
  /** Scrolling past the contact stop without consent asks before flying to the Averno. */
  askD9: () => void;
  /** Settled on the Averno with consent: show the warp log and open decode9. */
  leaveToD9: () => void;
  /** Scrolled back from the Averno: consent expires (d9.ok = false). */
  revokeD9: () => void;
  /** Autopilot/drag: fly to stop `index` (asks first for the Averno). */
  goTo: (index: number) => void;
}

/**
 * Builds the 3D stage on the canvas and wires it to the bridge (injected by the composition root).
 * Returns the API to register plus `dispose`. May throw when WebGL is unavailable.
 */
export type ProfileStageFactory = (canvas: HTMLCanvasElement, bridge: ProfileStageBridge) => ProfileStageApi & { dispose: () => void };

export interface UseProfileResult {
  bridge: ProfileStageBridge;
  /** The 3D stage registered its API (DOM fallbacks are off). */
  stageReady: boolean;
  stopRefs: RefObject<(HTMLElement | null)[]>;
  needleRef: RefObject<HTMLElement>;
  dialRef: RefObject<HTMLElement>;
  inStop: number;
  status: StationStatus;
  chapter: ChapterId;
  panelOpen: boolean;
  aboutOpen: boolean;
  walkie: WalkieView;
  asleep: boolean;
  showSim: boolean;
  news: NewsItem[];
  sound: { wanted: boolean; playing: boolean; toggle: () => void; buttonRef: RefObject<HTMLButtonElement> };
  d9: { asking: boolean; warpLog: string | null; ask: () => void; close: (go: boolean) => void };
  actions: {
    pressStation: (index: number) => void;
    goTo: (index: number) => void;
    openChapter: (id: ChapterId) => void;
    goChapter: (id: ChapterId) => void;
    closeChapter: () => void;
    chapterAction: (action: string) => void;
    pressStopCta: (open: ChapterId | 'decode9') => void;
    openWalkie: () => void;
    closeWalkie: () => void;
    walkieFromChapter: () => void;
    restart: () => void;
    replay: () => void;
    toggleAbout: () => void;
    closeAbout: () => void;
    simulate: (hour: number) => void;
  };
}
