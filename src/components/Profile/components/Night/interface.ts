import type { RefObject } from 'react';

export interface NightProps {
  alarmRef: RefObject<HTMLDivElement>;
  /** `?sim=1`: show the temporary hour simulator. */
  showSim: boolean;
  onSimulate: (hour: number) => void;
}
