import type { MouseEvent, RefObject } from 'react';
import type { EntrySide } from '@/data/entry';
import type { TiltFilterPort, TiltPromptState } from '@/hooks/useDeviceTilt';
import type { Analytics } from '@/interfaces/analytics';

/** Port: face frames drawn on a canvas (implemented by lib/canvas/faceFrames). */
export interface FaceRenderer {
  load: (onFrame: () => void) => Promise<void>;
  attach: (canvas: HTMLCanvasElement) => void;
  fit: (width: number, height: number, dpr: number) => void;
  show: (index: number, centred: boolean) => void;
  current: () => number;
  dispose: () => void;
}

/** Port: byte-measured preload of the destination (implemented by lib/net/bytePreloader). */
export interface Preloader {
  preload: (files: readonly string[], onProgress: (p: number) => void) => Promise<void>;
  dispose: () => void;
}

/** Infrastructure injected by the composition root (index.tsx). Factories: created per mount/use. */
export interface EntryDeps {
  createFace: () => FaceRenderer;
  createPreloader: () => Preloader;
  createTiltFilter: () => TiltFilterPort;
  /** Records the chosen side (`choose_side`). */
  analytics: Analytics;
}

export type EntryProps = Record<string, never>;

export interface WarpState {
  to: EntrySide | null;
  show: boolean;
  /** 0–1, smoothed. */
  progress: number;
}

export interface UseEntryResult {
  refs: {
    root: RefObject<HTMLDivElement>;
    hero: RefObject<HTMLDivElement>;
    canvas: RefObject<HTMLCanvasElement>;
    seamLine: RefObject<SVGLineElement>;
    seamGlow: RefObject<SVGLineElement>;
    copyRed: RefObject<HTMLDivElement>;
    copyBlue: RefObject<HTMLDivElement>;
  };
  bootPercent: number;
  ready: boolean;
  leaving: EntrySide | null;
  warp: WarpState;
  tiltPrompt: TiltPromptState;
  requestTilt: () => void;
  debugText: string | null;
  canAim: boolean;
  aiming: boolean;
  setAiming: (on: boolean) => void;
  go: (side: EntrySide, e?: MouseEvent) => void;
  onSideClick: (side: EntrySide, e: MouseEvent) => void;
  onCtaFocus: (side: EntrySide) => void;
}
