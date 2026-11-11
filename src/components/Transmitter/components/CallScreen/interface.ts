import type { RefObject } from 'react';
import type { CallLine } from '@/data/transmitter/callScript';
import type { PortraitImage } from '@/data/transmitter/portraits';
import type { TransmitterStatus } from '@/utils/transmitter';

export interface CallScreenProps {
  /** The call screen is the visible one (stops the call timer otherwise). */
  active: boolean;
  status: TransmitterStatus;
  /** "RESTABLECER CONTACTO" → main screen. */
  onToMain: () => void;
}

/** 0 lock screen · 1 talking · 2 signal lost. */
export type CallPhase = 0 | 1 | 2;

export interface TypedLine {
  id: number;
  line: CallLine;
  shown: number;
  done: boolean;
}

export interface UseCallScreenReturn {
  alias: string;
  phase: CallPhase;
  lines: readonly TypedLine[];
  elapsed: string;
  portrait: PortraitImage;
  stateLabel: string;
  restore: boolean;
  logRef: RefObject<HTMLDivElement>;
  onPress: () => void;
  answer: () => void;
  onButton: () => void;
  exit: () => void;
}
