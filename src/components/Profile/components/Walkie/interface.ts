import type { RefObject } from 'react';
import type { WalkieGateway, WalkieStatus } from '@/interfaces/walkie';
import type { WalkieView } from '../../interface';

export interface WalkieProps {
  view: WalkieView;
  gateway: WalkieGateway;
  frequencies: readonly { k: string; v: string; copy: string }[];
  bubbleRef: RefObject<HTMLDivElement>;
  hintRef: RefObject<HTMLDivElement>;
  /** Stage not running: center the card instead of placing it next to the 3D walkie. */
  centered: boolean;
  onRestart: () => void;
  onClose: () => void;
}

export type WalkieNotes = Record<WalkieStatus | 'short' | 'sending', string>;
