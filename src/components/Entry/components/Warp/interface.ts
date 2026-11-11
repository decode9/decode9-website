import type { EntrySide } from '@/data/entry';

export interface WarpProps {
  to: EntrySide | null;
  show: boolean;
  /** 0–1. */
  progress: number;
  /** Terminal lines of the red exit. */
  log: readonly string[];
  /** Formats the red log for a progress (pure, from lib). */
  formatLog: (lines: readonly string[], p: number) => string;
}
