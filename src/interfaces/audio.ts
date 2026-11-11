/** Something that makes sound in the browser (Web Audio lives only in lib/audio). */
export interface SoundSource {
  /** Starts (or resumes) the sound; must be called from a user gesture the first time. */
  start: () => void;
  stop: () => void;
  readonly playing: boolean;
  /** Releases the AudioContext and timers. */
  dispose: () => void;
}

/** Sound source with a mute switch persisted by the caller. */
export interface MutableSound extends SoundSource {
  setMuted: (muted: boolean) => void;
  readonly muted: boolean;
}

/** Text-to-speech (speechSynthesis) used by the mobile transmitter. */
export interface SpeechPort {
  readonly supported: boolean;
  speak: (text: string, options?: { lang?: string; rate?: number; pitch?: number }) => Promise<void>;
  cancel: () => void;
}
