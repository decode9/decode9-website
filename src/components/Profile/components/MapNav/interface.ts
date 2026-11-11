import type { Station } from '@/interfaces/profile';

export interface MapNavProps {
  stations: readonly Station[];
  current: number;
  /** Worlds fully terraformed. */
  done: boolean[];
  onGo: (index: number) => void;
}
