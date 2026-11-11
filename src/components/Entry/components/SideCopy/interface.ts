import type { MouseEvent, RefObject } from 'react';
import type { EntrySide } from '@/data/entry';

export interface SideCopyProps {
  side: EntrySide;
  /** Destination shown in the link (navigation itself is handled by onGo, after the warp). */
  href: string;
  elRef: RefObject<HTMLDivElement>;
  onGo: (side: EntrySide, e: MouseEvent) => void;
  onFocusCta: (side: EntrySide) => void;
}
