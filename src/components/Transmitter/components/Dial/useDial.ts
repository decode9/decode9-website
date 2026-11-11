import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useTransmitterFrame from '@/hooks/useTransmitterFrame';
import { DIAL, STATIONS } from '@/data/transmitter/stations';
import {
  buildDialTicks,
  clampDialAngle,
  clampStation,
  dialWobbleTarget,
  stationAtAngle,
  stationFromTap,
  stationPosition,
} from '@/utils/transmitter';
import type { DialProps, UseDialReturn } from './interface';

const { step: STEP, cx: CX, cy: CY } = DIAL;
const DRAG_DEG_PER_PX = 0.22;
const DRAG_THRESHOLD = 4;
/** Hexagon outline of the station buttons (pointy corners cut). */
const HEX = '-14,-19 19,-19 19,14 14,19 -19,19 -19,-14';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Rotary dial: drag to rotate (snaps to the nearest station), tap a station or the left/right side,
 * arrows on the keyboard. The rotor eases to its target angle and wobbles with the device tilt.
 */
const useDial = ({ station, onTune, onClick, onPress, getTilt, active }: DialProps): UseDialReturn => {
  const dialRef = useRef<HTMLDivElement>(null);
  const wobbleRef = useRef<SVGGElement>(null);
  const rotorRef = useRef<SVGGElement>(null);
  const uprights = useRef<(SVGGElement | null)[]>([]);
  const angle = useRef(-station * STEP);
  const shownAngle = useRef(angle.current);
  const wobble = useRef(0);
  const drag = useRef<{ x: number; angle: number; moved: boolean; target: number | null } | null>(null);
  const previewIndex = useRef<number | null>(null);
  const [preview, setPreview] = useState(station);
  const [reduceMotion] = useState(prefersReducedMotion);

  const ticks = useMemo(() => buildDialTicks(CX, CY), []);

  /* every tune (including re-tuning the same station after a drag) eases back to the station */
  useEffect(() => {
    angle.current = -station * STEP;
    setPreview(station);
  }, [station]);

  const commit = useCallback(
    (index: number) => {
      const next = clampStation(index, STATIONS.length);
      angle.current = -next * STEP;
      setPreview(next);
      onTune(next);
    },
    [onTune],
  );

  useTransmitterFrame(() => {
    const target = dialWobbleTarget(getTilt(), reduceMotion);
    wobble.current += (target - wobble.current) * 0.025;
    shownAngle.current += (angle.current - shownAngle.current) * 0.2;
    if (Math.abs(angle.current - shownAngle.current) < 0.01) shownAngle.current = angle.current;
    wobbleRef.current?.setAttribute('transform', `rotate(${wobble.current.toFixed(2)} ${CX} ${CY})`);
    rotorRef.current?.setAttribute('transform', `rotate(${shownAngle.current.toFixed(2)} ${CX} ${CY})`);
    const upright = `rotate(${(-shownAngle.current - wobble.current).toFixed(2)})`;
    uprights.current.forEach((g) => g?.setAttribute('transform', upright));
  }, active);

  const setUprightRef = useCallback(
    (index: number) => (el: SVGGElement | null) => {
      uprights.current[index] = el;
    },
    [],
  );

  const onPointerDown: UseDialReturn['onPointerDown'] = useCallback(
    (e) => {
      onPress();
      const hit = (e.target as Element).closest?.('[data-st]');
      drag.current = { x: e.clientX, angle: angle.current, moved: false, target: hit ? Number(hit.getAttribute('data-st')) : null };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Synthetic pointers can't be captured.
      }
    },
    [onPress],
  );

  const onPointerMove: UseDialReturn['onPointerMove'] = useCallback(
    (e) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (Math.abs(dx) > DRAG_THRESHOLD) d.moved = true;
      if (!d.moved) return;
      const next = clampDialAngle(d.angle + dx * DRAG_DEG_PER_PX, STATIONS.length, STEP);
      angle.current = next;
      shownAngle.current = next;
      const n = stationAtAngle(next, STEP);
      if (n !== previewIndex.current && n >= 0 && n < STATIONS.length) {
        previewIndex.current = n;
        onClick();
        setPreview(n);
      }
    },
    [onClick],
  );

  const onPointerUp: UseDialReturn['onPointerUp'] = useCallback(
    (e) => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      if (d.moved) {
        commit(stationAtAngle(angle.current, STEP));
        return;
      }
      if (d.target != null) {
        commit(d.target);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      commit(stationFromTap((e.clientX - rect.left) / rect.width, station));
    },
    [commit, station],
  );

  const onKeyDown: UseDialReturn['onKeyDown'] = useCallback(
    (e) => {
      if (e.key === 'ArrowRight') commit(station + 1);
      if (e.key === 'ArrowLeft') commit(station - 1);
    },
    [commit, station],
  );

  const stations = useMemo(
    () =>
      STATIONS.map((s, index) => ({
        station: s,
        index,
        ...stationPosition(index, STEP, CX, CY),
        on: index === station,
      })),
    [station],
  );

  return {
    dialRef,
    wobbleRef,
    rotorRef,
    setUprightRef,
    ticks,
    stations,
    hexagon: HEX,
    freq: STATIONS[preview].freq,
    name: STATIONS[preview].name,
    live: `Canal ${STATIONS[station].name}`,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  };
};

export default useDial;
