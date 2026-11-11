import type { CallLine } from '@/data/transmitter/callScript';

export interface TranscriptLineProps {
  line: CallLine;
  /** Characters typed so far. */
  shown: number;
  done: boolean;
}
