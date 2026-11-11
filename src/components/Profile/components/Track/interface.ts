import type { RefObject } from 'react';
import type { ChapterId, Station } from '@/interfaces/profile';

export interface TrackProps {
  stations: readonly Station[];
  /** Stop currently in view (gets the entrance animation). */
  inStop: number;
  stopRefs: RefObject<(HTMLElement | null)[]>;
  onCta: (open: ChapterId | 'decode9') => void;
}
