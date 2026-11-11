'use client';

import { useCallback, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { Bilingual } from '@/interfaces/terminal';

/** What a screen asks for when it opens a window (original openWin options). */
export interface WindowSpec {
  title: Bilingual;
  /** Fractions of the desk (desktop only). */
  x: number;
  y: number;
  w: number;
  render: () => ReactNode;
  /** Same key → replace content and bring to front. */
  key?: string;
  /** Windows of a group share placement offsets; same group+title → bring to front. */
  group?: string;
  /** Base windows go to the dock when closed with ✕. */
  base?: boolean;
  /** Extra classes understood by the Window component: 'small' | 'wide' | 'scanw' | 'wowin' | 'qrw'. */
  cls?: string;
  delay?: number;
}

export interface WindowState {
  uid: number;
  /** W-NN counter shown in the bar. */
  n: number;
  spec: WindowSpec;
  /** Bumped when a key window receives new content (forces remount of the body). */
  version: number;
  z: number;
  left?: number;
  top?: number;
  width?: number;
  maxHeight?: number;
  min: boolean;
  arriving: boolean;
  leaving: boolean;
  /** Bumped on each flick (restarts the CSS animation). */
  flick: number;
  fx: number;
  fy: number;
}

export interface WindowManagerApi {
  windows: WindowState[];
  closed: WindowSpec[];
  topUid: number | null;
  open: (spec: WindowSpec) => number | null;
  close: (uid: number, opts?: { toDock?: boolean }) => void;
  closeAll: () => void;
  /** Removes every window at once and empties the dock (screen change / tab change). */
  clear: () => void;
  restore: (index: number) => void;
  front: (uid: number) => void;
  setMin: (uid: number, on: boolean) => void;
  arrange: (mode: 'topic' | 'cascade') => void;
  arranging: boolean;
  moveTo: (uid: number, left: number, top: number) => void;
  isDesk: () => boolean;
}

const ARRIVE_DIRS: ReadonlyArray<[number, number]> = [
  [-60, -30],
  [60, -30],
  [-50, 40],
  [50, 40],
  [0, -60],
];

export const isDeskViewport = (): boolean => typeof window !== 'undefined' && window.innerWidth > 900;

/** Window system of the stage (original openWin/closeWin/front/flick/setMin/arrangeWins), as React state. */
const useWindowManager = (deskRef: RefObject<HTMLDivElement>, reduceMotion: boolean): WindowManagerApi => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [closed, setClosed] = useState<WindowSpec[]>([]);
  const [arranging, setArranging] = useState(false);
  const ref = useRef(windows);
  ref.current = windows;
  const zRef = useRef(10);
  const uidRef = useRef(0);
  const nRef = useRef(0);

  const update = useCallback((uid: number, patch: Partial<WindowState> | ((w: WindowState) => Partial<WindowState>)) => {
    setWindows((list) => list.map((w) => (w.uid === uid ? { ...w, ...(typeof patch === 'function' ? patch(w) : patch) } : w)));
  }, []);

  const front = useCallback(
    (uid: number) => {
      zRef.current += 1;
      update(uid, { z: zRef.current });
    },
    [update],
  );

  const flick = useCallback((uid: number) => update(uid, (w) => ({ flick: w.flick + 1 })), [update]);

  const setMin = useCallback((uid: number, on: boolean) => update(uid, { min: on }), [update]);

  const open = useCallback(
    (spec: WindowSpec): number | null => {
      const desk = deskRef.current;
      if (!desk) return null;
      const live = ref.current.filter((w) => !w.leaving);
      let groupCount = 0;
      if (spec.group) {
        const peers = live.filter((w) => w.spec.group === spec.group);
        groupCount = peers.length;
        const same = peers.find((w) => w.spec.title[0] === spec.title[0]);
        if (same) {
          front(same.uid);
          flick(same.uid);
          return same.uid;
        }
      }
      if (spec.key) {
        const same = live.find((w) => w.spec.key === spec.key);
        if (same) {
          update(same.uid, (w) => ({ spec, version: w.version + 1 }));
          front(same.uid);
          flick(same.uid);
          return same.uid;
        }
      }
      uidRef.current += 1;
      nRef.current += 1;
      zRef.current += 1;
      const uid = uidRef.current;
      const geo: Partial<WindowState> = {};
      if (isDeskViewport()) {
        const dw = desk.clientWidth;
        const dh = desk.clientHeight;
        const jx = (Math.random() - 0.5) * 24 + (groupCount % 6) * 28;
        const jy = (Math.random() - 0.5) * 20 + (groupCount % 6) * 24;
        const width = Math.max(260, Math.min(dw - 8, spec.w * dw));
        const left = Math.max(0, Math.min(dw - width, spec.x * dw + jx));
        const top = Math.max(0, Math.min(dh - 80, spec.y * dh + jy));
        Object.assign(geo, { width, left, top, maxHeight: Math.max(160, dh - top - 4) });
      }
      const [fx, fy] = ARRIVE_DIRS[Math.floor(Math.random() * ARRIVE_DIRS.length)];
      const win: WindowState = {
        uid,
        n: nRef.current,
        spec,
        version: 0,
        z: zRef.current,
        min: !isDeskViewport() && /small/.test(spec.cls ?? ''),
        arriving: true,
        leaving: false,
        flick: 0,
        fx,
        fy,
        ...geo,
      };
      setWindows((list) => [...list, win]);
      window.setTimeout(() => update(uid, { arriving: false }), 600 + (spec.delay ?? 0));
      return uid;
    },
    [deskRef, flick, front, update],
  );

  const close = useCallback(
    (uid: number, opts: { toDock?: boolean } = {}) => {
      const w = ref.current.find((x) => x.uid === uid);
      if (!w || w.leaving) return;
      if (opts.toDock && w.spec.base) setClosed((c) => [...c, w.spec]);
      update(uid, { leaving: true });
      window.setTimeout(() => setWindows((list) => list.filter((x) => x.uid !== uid)), reduceMotion ? 0 : 220);
    },
    [reduceMotion, update],
  );

  const closeAll = useCallback(() => ref.current.forEach((w) => close(w.uid)), [close]);

  const clear = useCallback(() => {
    setWindows([]);
    setClosed([]);
  }, []);

  const restore = useCallback(
    (index: number) => {
      const spec = closed[index];
      if (!spec) return;
      setClosed((c) => c.filter((_, i) => i !== index));
      open({ ...spec, delay: 0 });
    },
    [closed, open],
  );

  const moveTo = useCallback(
    (uid: number, left: number, top: number) => {
      const dh = deskRef.current?.clientHeight ?? 0;
      update(uid, { left, top, maxHeight: Math.max(160, dh - top - 4) });
    },
    [deskRef, update],
  );

  const arrange = useCallback(
    (mode: 'topic' | 'cascade') => {
      const desk = deskRef.current;
      const live = ref.current.filter((w) => !w.leaving);
      if (!desk || !isDeskViewport() || !live.length) return;
      const dw = desk.clientWidth;
      const dh = desk.clientHeight;
      const G = 8;
      const OFF = 30;
      const geo = new Map<number, Partial<WindowState>>();
      const place = (w: WindowState, patch: Partial<WindowState>) => {
        zRef.current += 1;
        geo.set(w.uid, { ...patch, min: false, z: zRef.current });
      };
      if (mode === 'cascade') {
        const cw = Math.max(300, Math.min(dw * 0.52, dw - OFF * live.length));
        live.forEach((w, i) => {
          const left = Math.min(i * OFF, dw - cw);
          const top = Math.min(i * OFF, dh - 160);
          place(w, { left, top, width: cw, maxHeight: dh - top - 4 });
        });
      } else {
        const groups: WindowState[][] = [];
        const index = new Map<string, number>();
        live.forEach((w) => {
          const k = w.spec.group ? `g:${w.spec.group}` : `k:${w.spec.key ?? w.uid}`;
          if (!index.has(k)) {
            index.set(k, groups.length);
            groups.push([]);
          }
          groups[index.get(k) as number].push(w);
        });
        const n = groups.length;
        const cols = Math.max(1, Math.min(n, Math.floor((dw + G) / (300 + G))));
        const rows = Math.ceil(n / cols);
        const cellW = (dw - G * (cols - 1)) / cols;
        const cellH = (dh - G * (rows - 1)) / rows;
        groups.forEach((g, i) => {
          const x0 = (i % cols) * (cellW + G);
          const y0 = Math.floor(i / cols) * (cellH + G);
          const m = g.length;
          const off = Math.min(OFF, (cellW - 260) / Math.max(1, m - 1) || OFF);
          g.forEach((w, j) => {
            const top = y0 + OFF * j * 0.8;
            place(w, { left: x0 + off * j, top, width: Math.max(260, cellW - off * (m - 1)), maxHeight: Math.max(140, y0 + cellH - top) });
          });
        });
      }
      setArranging(true);
      setWindows((list) => list.map((w) => (geo.has(w.uid) ? { ...w, ...geo.get(w.uid) } : w)));
      window.setTimeout(() => setArranging(false), 450);
    },
    [deskRef],
  );

  const topUid = useMemo(() => {
    const live = windows.filter((w) => !w.leaving);
    return live.length ? live.reduce((a, b) => (b.z > a.z ? b : a)).uid : null;
  }, [windows]);

  return {
    windows,
    closed,
    topUid,
    open,
    close,
    closeAll,
    clear,
    restore,
    front,
    setMin,
    arrange,
    arranging,
    moveTo,
    isDesk: isDeskViewport,
  };
};

export default useWindowManager;
