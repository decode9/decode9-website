import type { KeyboardEvent, PointerEvent, RefObject } from 'react';
import type { Station } from '@/data/transmitter/stations';
import type { DialTick } from '@/utils/transmitter';

export interface DialProps {
  /** Tuned station index. */
  station: number;
  onTune: (index: number) => void;
  /** Tick sound + vibration while dragging over a station. */
  onClick: () => void;
  /** First touch (unlocks audio). */
  onPress: () => void;
  /** Smoothed device tilt (deg) that wobbles the dial. */
  getTilt: () => number;
  /** Animate only while the main screen is visible. */
  active: boolean;
}

export interface DialStationView {
  station: Station;
  index: number;
  x: string;
  y: string;
  on: boolean;
}

export interface UseDialReturn {
  dialRef: RefObject<HTMLDivElement>;
  wobbleRef: RefObject<SVGGElement>;
  rotorRef: RefObject<SVGGElement>;
  setUprightRef: (index: number) => (el: SVGGElement | null) => void;
  ticks: readonly DialTick[];
  stations: readonly DialStationView[];
  hexagon: string;
  freq: string;
  name: string;
  live: string;
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLDivElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}
