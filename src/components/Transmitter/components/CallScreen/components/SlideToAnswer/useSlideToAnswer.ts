import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { SlideToAnswerProps, UseSlideToAnswerReturn } from './interface';

/** Drag past 92% (or a simple tap, which animates the knob) answers the call. */
const useSlideToAnswer = ({ onPress, onAnswer }: Omit<SlideToAnswerProps, 'label'>): UseSlideToAnswerReturn => {
  const slideRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const max = useRef(0);
  const moved = useRef(0);
  const answerTimer = useRef<ReturnType<typeof setTimeout>>();
  const [knobStyle, setKnobStyle] = useState<CSSProperties>({});

  useEffect(() => () => clearTimeout(answerTimer.current), []);

  const onPointerDown: UseSlideToAnswerReturn['onPointerDown'] = useCallback(
    (e) => {
      onPress();
      startX.current = e.clientX;
      moved.current = 0;
      max.current = (slideRef.current?.clientWidth ?? 0) - (knobRef.current?.offsetWidth ?? 0) - 12;
      setKnobStyle((s) => ({ ...s, transition: 'none' }));
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Synthetic pointers can't be captured; dragging still works inside the slider.
      }
    },
    [onPress],
  );

  const onPointerMove: UseSlideToAnswerReturn['onPointerMove'] = useCallback(
    (e) => {
      if (startX.current == null) return;
      const dx = e.clientX - startX.current;
      const x = Math.max(0, Math.min(max.current, dx));
      moved.current = Math.max(moved.current, Math.abs(dx));
      if (x >= max.current * 0.92) {
        startX.current = null;
        setKnobStyle({ transition: 'none', transform: `translateX(${max.current}px)` });
        onAnswer();
        return;
      }
      setKnobStyle({ transition: 'none', transform: `translateX(${x}px)` });
    },
    [onAnswer],
  );

  const onPointerUp = useCallback(() => {
    if (startX.current == null) return;
    startX.current = null;
    if (moved.current < 6) {
      setKnobStyle({ transition: 'transform .45s', transform: `translateX(${max.current}px)` });
      answerTimer.current = setTimeout(onAnswer, 400);
    } else {
      setKnobStyle({ transition: 'transform .3s' });
    }
  }, [onAnswer]);

  const onKeyDown: UseSlideToAnswerReturn['onKeyDown'] = useCallback(
    (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      onPress();
      onAnswer();
    },
    [onAnswer, onPress],
  );

  return { slideRef, knobRef, knobStyle, onPointerDown, onPointerMove, onPointerUp, onKeyDown };
};

export default useSlideToAnswer;
