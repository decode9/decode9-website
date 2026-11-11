'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { decodeText } from '@/utils/decodeText';
import type { UseWindowResult, WindowProps } from './interface';

interface DragState {
  dx: number;
  dy: number;
  desk: DOMRect;
  pointerId: number;
}

type Deps = Pick<WindowProps, 'win' | 'arranging' | 'reduceMotion' | 'deskRef' | 'isDesk' | 'onFront' | 'onMin' | 'onMove'> & {
  flkClass: string;
};

/** Behaviour of one window: decode on open/flick, drag by the bar (pointer capture), Alt+arrows, tap-to-minimize on phones. */
const useWindow = ({ win, arranging, reduceMotion, deskRef, isDesk, onFront, onMin, onMove, flkClass }: Deps): UseWindowResult => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const [dragging, setDragging] = useState(false);
  const { uid, spec } = win;

  /* Open: decode title and [data-dec]; phones scroll grouped detail windows into view. */
  useEffect(() => {
    const delay = spec.delay ?? 0;
    const timers = [
      window.setTimeout(() => {
        decodeText(titleRef.current, 500, { reduceMotion });
        decodeText(bodyRef.current?.querySelector('[data-dec]'), 650, { reduceMotion });
      }, delay + 80),
    ];
    if (!isDesk() && spec.group && !spec.base) {
      timers.push(
        window.setTimeout(() => rootRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 180),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Runs once per window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Flick: restart the body animation and re-decode (original flick()). */
  useEffect(() => {
    const body = bodyRef.current;
    if (!win.flick || !body) return;
    body.classList.remove(flkClass);
    void body.offsetWidth;
    body.classList.add(flkClass);
    decodeText(body.querySelector('[data-dec]'), 550, { reduceMotion });
  }, [win.flick, flkClass, reduceMotion]);

  useEffect(() => {
    if (arranging && rootRef.current) rootRef.current.style.height = '';
  }, [arranging]);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onFront(uid);
      const target = e.target as Element;
      const bar = target.closest('[data-wbar]') as HTMLElement | null;
      const root = rootRef.current;
      const desk = deskRef.current;
      if (!bar || target.closest('button') || !isDesk() || !root || !desk) return;
      e.preventDefault();
      const r = root.getBoundingClientRect();
      drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, desk: desk.getBoundingClientRect(), pointerId: e.pointerId };
      bar.setPointerCapture(e.pointerId);
      setDragging(true);
    },
    [deskRef, isDesk, onFront, uid],
  );

  const onBarPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      const root = rootRef.current;
      if (!d || !root) return;
      const x = Math.max(-root.offsetWidth + 90, Math.min(d.desk.width - 90, e.clientX - d.desk.left - d.dx));
      const y = Math.max(0, Math.min(d.desk.height - 40, e.clientY - d.desk.top - d.dy));
      onMove(uid, x, y);
    },
    [onMove, uid],
  );

  const onBarPointerUp = useCallback(() => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
  }, []);

  const onBarClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isDesk() || (e.target as Element).closest('button')) return;
      onMin(uid, !win.min);
    },
    [isDesk, onMin, uid, win.min],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isDesk() || !e.altKey || !e.key.startsWith('Arrow')) return;
      e.preventDefault();
      const s = e.shiftKey ? 40 : 12;
      const root = rootRef.current;
      let x = win.left ?? root?.offsetLeft ?? 0;
      let y = win.top ?? root?.offsetTop ?? 0;
      if (e.key === 'ArrowLeft') x -= s;
      if (e.key === 'ArrowRight') x += s;
      if (e.key === 'ArrowUp') y -= s;
      if (e.key === 'ArrowDown') y += s;
      onMove(uid, x, Math.max(0, y));
    },
    [isDesk, onMove, uid, win.left, win.top],
  );

  return { rootRef, titleRef, bodyRef, dragging, onPointerDown, onBarPointerMove, onBarPointerUp, onBarClick, onKeyDown };
};

export default useWindow;
