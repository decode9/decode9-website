import type { ReactNode, RefObject } from 'react';
import type { KeyValueStorage } from '@/interfaces/storage';
import type { BabbleOptions, MotionSensor, RadioEngine, SpeechReader, Vibrate } from '@/interfaces/transmitter';
import type { PortraitImage } from '@/data/transmitter/portraits';
import type { TransmitterStatus } from '@/utils/transmitter';

export type TransmitterScreen = 'call' | 'main' | 'off';

/**
 * Events phase 3b listens to:
 *  - `station`: the dial changed (or first tuned) to a station → close sheets, pause media.
 *  - `exit`: ✕ pressed → close fullscreen and sheets, pause media.
 *  - `hidden`: the tab went to the background → pause media.
 */
export type TransmitterEvent = 'station' | 'exit' | 'hidden';

/**
 * What the panes, sheets, fullscreen player and off screen (phase 3b) can do with the transmitter.
 * Read it with `useTransmitterApi()` (Transmitter/context.ts). All functions are stable.
 */
export interface TransmitterApi {
  /** `?alias=` from the terminal QR, sanitised ('' when absent). Prefills the contact form. */
  alias: string;
  /** Creates/resumes the AudioContext; call from a user gesture before playing sounds. */
  ensureAudio: () => void;
  /** Demonoid babble + "HABLANDO" status; `onEnd` runs when it finishes (not when interrupted). Returns seconds. */
  speak: (text: string, onEnd?: () => void, options?: BabbleOptions) => number;
  /** Cuts babble and browser speech; also ends a pending `readAloud` (its onEnd runs). */
  stopSpeak: () => void;
  /** Reads `text` with speechSynthesis ("LÉEMELO"). Toasts and ends at once if unsupported. */
  readAloud: (text: string, onEnd?: () => void) => void;
  readonly speechSupported: boolean;
  /** True while speechSynthesis is speaking. */
  isReading: () => boolean;
  setStatic: (level: number, timeConstant?: number) => void;
  beep: (frequency?: number, duration?: number, delay?: number) => void;
  squelch: (duration?: number, volume?: number) => void;
  /** UI tick sound + 8ms vibration. */
  click: () => void;
  vibrate: Vibrate;
  /** Adds portrait/wave distortion (0–1). */
  kick: (amount: number) => void;
  /** Sets the lost-signal level (0–1); >.5 shows "INTERFERENCIA". */
  setLost: (level: number) => void;
  getLost: () => number;
  /** Recomputes the ESTADO label (lost > speaking > media), like the original `setStatus()`. */
  refreshStatus: () => void;
  /** Media (video/audio/transmitting) playing → "TRANSMITIENDO" and a lively wave. */
  setMediaOn: (on: boolean) => void;
  /** Portrait of the main screen unit. */
  setMainPortrait: (image: PortraitImage) => void;
  /** Bottom toast of the main screen (2.6 s). */
  toast: (message: string) => void;
  /** Whether sound is muted (read at call time). */
  isMuted: () => boolean;
  /** Starts the gyroscope distortion (asks permission on iOS); call from a user gesture. */
  enableMotion: () => void;
  /** Subscribe to transmitter events; returns the unsubscribe function. */
  on: (event: TransmitterEvent, listener: () => void) => () => void;
  /** ✕ / "close transmission": stops everything and shows the off screen. */
  exit: () => void;
}

/**
 * Slots filled by phase 3b. Each pane i is shown when station i is tuned (0 CONTACTO, 1 VIDEOS,
 * 2 LECTURAS, 3 AUDIOS); the wrapper (.pane, scrollable, fades in/out) is provided by MainScreen.
 */
export interface TransmitterSlots {
  /** Contents of the 4 panes, indexed like STATIONS. Missing entries show the pane intro line. */
  panes?: readonly ReactNode[];
  /** Rendered inside the main screen above the dial/panes (the video/audio/reader sheets). */
  mainOverlays?: ReactNode;
  /** Rendered as the off-air screen (#s-off) when `screen === 'off'`; remounted on every exit. */
  offScreen?: ReactNode;
  /** Rendered outside the device frame (position:fixed fullscreen player). */
  fullscreen?: ReactNode;
}

/** Infrastructure injected by the composition root (Transmitter/index.tsx). */
export interface TransmitterDeps {
  createRadio: (options: { muted: boolean }) => RadioEngine;
  createSpeech: () => SpeechReader;
  createMotion: () => MotionSensor;
  drawWave: (canvas: HTMLCanvasElement, amp: number, t: number, spectrum: Uint8Array | null) => void;
  vibrate: Vibrate;
  storage: KeyValueStorage;
}

export interface TransmitterProps {
  slots?: TransmitterSlots;
}

export interface UseTransmitterReturn {
  rootRef: RefObject<HTMLDivElement>;
  api: TransmitterApi;
  screen: TransmitterScreen;
  exitCount: number;
  muted: boolean;
  toggleMute: () => void;
  status: TransmitterStatus;
  station: number;
  mainPortrait: PortraitImage;
  toastMessage: string;
  toastVisible: boolean;
  tune: (index: number) => void;
  toMain: () => void;
  getTilt: () => number;
}
