import type { RefObject } from 'react';
import type { Station } from '@/interfaces/profile';
import type { StationStatus } from '../../interface';

export interface TopBarProps {
  stations: readonly Station[];
  status: StationStatus;
  dialRef: RefObject<HTMLElement>;
  needleRef: RefObject<HTMLElement>;
  onStation: (index: number) => void;
}
