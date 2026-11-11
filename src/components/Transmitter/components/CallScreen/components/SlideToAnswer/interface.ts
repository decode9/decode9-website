import type { CSSProperties, KeyboardEvent, PointerEvent, RefObject } from 'react';

export interface SlideToAnswerProps {
  label: string;
  /** First touch (unlocks audio). */
  onPress: () => void;
  onAnswer: () => void;
}

export interface UseSlideToAnswerReturn {
  slideRef: RefObject<HTMLDivElement>;
  knobRef: RefObject<HTMLDivElement>;
  knobStyle: CSSProperties;
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}
