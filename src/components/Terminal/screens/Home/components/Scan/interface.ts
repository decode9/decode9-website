import type { CrtSynth } from '@/lib/audio/createCrtSynth';

export interface ScanProps {
  synth: CrtSynth;
  setMuted: (muted: boolean) => void;
  reduceMotion: boolean;
  /** Opens the Sputnik 1 info window. */
  onInfo: () => void;
}
