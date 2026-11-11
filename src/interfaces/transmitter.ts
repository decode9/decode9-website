import type { SpeechPort } from './audio';

/** Options of the unintelligible "demonoid" voice (formant syllables + laughs). */
export interface BabbleOptions {
  laughs?: boolean;
  pitch?: number;
}

/**
 * Walkie-talkie sound engine of the mobile transmitter (Web Audio lives only in lib/audio).
 * Every method is a no-op until `ensure()` created the AudioContext from a user gesture.
 */
export interface RadioEngine {
  /** Creates or resumes the AudioContext. Returns false when Web Audio is not available. */
  ensure: () => boolean;
  readonly ready: boolean;
  setMuted: (muted: boolean) => void;
  /** Master level (call volume vs background volume). */
  setLevel: (level: number) => void;
  /** Background static level, approached with time constant `timeConstant` seconds. */
  setStatic: (level: number, timeConstant?: number) => void;
  squelch: (duration?: number, volume?: number) => void;
  beep: (frequency?: number, duration?: number, delay?: number) => void;
  /** Short UI tick (dial, tuning). */
  click: () => void;
  /** Speaks `text` as formant babble. Returns its duration in seconds (an estimate when there is no audio). */
  babble: (text: string, options?: BabbleOptions) => number;
  /** Cuts any babble that is still scheduled. */
  silenceVoice: () => void;
  /** Copies the analyser spectrum into `target`. Returns false when there is no audio yet. */
  readFrequencies: (target: Uint8Array) => boolean;
  dispose: () => void;
}

/** Text-to-speech used by the reader ("LÉEMELO"); adds the live speaking flag to the shared port. */
export interface SpeechReader extends SpeechPort {
  readonly speaking: boolean;
  dispose: () => void;
}

/** Device motion / mouse movement turned into signal distortion. */
export interface MotionSensor {
  /** Starts listening to the gyroscope (asks permission on iOS). Call from a user gesture. */
  enable: () => Promise<void>;
  /** 0–1 distortion from shaking; decays every frame with `decay()`. */
  readonly shake: number;
  /** Smoothed left/right tilt in degrees (gyroscope gamma or mouse X). */
  readonly tilt: number;
  /** Adds distortion (clamped to 1). */
  kick: (amount: number) => void;
  /** Applies the per-frame decay. */
  decay: () => void;
  dispose: () => void;
}

/** Haptic feedback (navigator.vibrate). */
export type Vibrate = (pattern: number | number[]) => void;
