'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import {
  ENTRY_MOBILE_MQ,
  ENTRY_ROUTES,
  ENTRY_TIMING,
  FACE_CENTER,
  FACE_FRAMES,
  resolveDestination,
  type EntrySide,
} from '@/data/entry';
import useDevice from '@/hooks/useDevice';
import useDeviceTilt from '@/hooks/useDeviceTilt';
import useInputMode from '@/hooks/useInputMode';
import { activeSide, fractionalFrame, frameFor, idleTarget, seamEdges } from '@/lib/canvas/entryMotion';
import { withBase } from '@/utils/asset';
import { sleep } from '@/utils/async';
import type { EntryDeps, FaceRenderer, UseEntryResult, WarpState } from './interface';

const LAST = FACE_FRAMES.length - 1;

interface Motion {
  target: number;
  pos: number;
  lastMove: number;
  auto: boolean;
  leaving: EntrySide | null;
  take: number;
  fx: number;
  fy: number;
}

/** State and behaviour of «Elige tu lado»: boot, pointer/gyro split, face frames and the exit warp. */
const useEntry = ({ createFace, createPreloader, createTiltFilter, analytics }: EntryDeps): UseEntryResult => {
  const device = useDevice(); // phone routing (read at click time)
  const input = useInputMode(); // synchronous: the loop must not restart
  const touch = input.isTouch;
  const reduce = input.reducedMotion;

  const refs = {
    root: useRef<HTMLDivElement>(null),
    hero: useRef<HTMLDivElement>(null),
    canvas: useRef<HTMLCanvasElement>(null),
    seamLine: useRef<SVGLineElement>(null),
    seamGlow: useRef<SVGLineElement>(null),
    copyRed: useRef<HTMLDivElement>(null),
    copyBlue: useRef<HTMLDivElement>(null),
  };
  const faceRef = useRef<FaceRenderer | null>(null);
  const motion = useRef<Motion>({ target: 0.5, pos: 0.5, lastMove: 0, auto: true, leaving: null, take: 0, fx: 0, fy: 0 });

  const [bootPercent, setBootPercent] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState<EntrySide | null>(null);
  const [warp, setWarp] = useState<WarpState>({ to: null, show: false, progress: 0 });
  const [aiming, setAiming] = useState(false);

  const debug = useMemo(() => typeof window !== 'undefined' && /[?&]giro=1/.test(window.location.search), []);
  const tiltFilter = useMemo(() => createTiltFilter(), [createTiltFilter]);
  const tilt = useDeviceTilt({
    enabled: touch,
    filter: tiltFilter,
    isPaused: () => motion.current.leaving !== null,
    debug,
    fallbackMs: ENTRY_TIMING.tiltFallbackMs,
    noticeMs: ENTRY_TIMING.tiltNoticeMs,
  });

  const setTarget = useCallback((v: number) => {
    const m = motion.current;
    if (m.leaving) return;
    m.target = Math.min(1, Math.max(0, v));
    m.lastMove = performance.now();
    m.auto = false;
  }, []);

  /* Boot, face canvas and the animation loop. */
  useEffect(() => {
    // Old links shared as decode9.codes/#something keep landing on decode9
    if (window.location.hash.length > 1) {
      window.location.replace(withBase(ENTRY_ROUTES.decode9) + window.location.hash);
      return undefined;
    }
    const root = refs.root.current;
    const hero = refs.hero.current;
    const canvas = refs.canvas.current;
    const seamLine = refs.seamLine.current;
    const seamGlow = refs.seamGlow.current;
    const cRed = refs.copyRed.current;
    const cBlue = refs.copyBlue.current;
    if (!root || !hero || !canvas || !seamLine || !seamGlow || !cRed || !cBlue) return undefined;

    const face = createFace();
    faceRef.current = face;
    face.attach(canvas);
    const mq = window.matchMedia(ENTRY_MOBILE_MQ);
    let cancelled = false;
    let raf = 0;

    const fit = () => {
      const r = hero.getBoundingClientRect();
      face.fit(r.width, r.height, window.devicePixelRatio || 1);
    };

    // Phone: each block in its own band, measured for real once the fonts are in
    const layout = () => {
      if (!mq.matches) {
        cBlue.style.top = '';
        cBlue.style.bottom = '';
        hero.style.setProperty('--hy', '0px');
        hero.style.scale = '';
        hero.style.width = '';
        return;
      }
      const gap = Math.max(18, window.innerHeight * 0.025);
      const ty = parseFloat(getComputedStyle(cRed).translate.split(' ')[1]) || 0;
      const rb = cRed.getBoundingClientRect().bottom - ty;
      cBlue.style.bottom = 'auto';
      cBlue.style.top = `${Math.round(rb + gap)}px`;
      const bb = cBlue.getBoundingClientRect().bottom;
      hero.style.width = '';
      hero.style.scale = '';
      const hh = hero.offsetHeight; // the hair starts 4% below the frame top
      const free = window.innerHeight - (bb + gap * 0.6);
      // if it does not fit, shrink the width (stays centred and on the floor)
      if (hh * 0.96 > free) hero.style.width = `${Math.round(hero.offsetWidth * Math.max(0.7, free / (hh * 0.96)))}px`;
      hero.style.setProperty('--hy', '0px');
      if (face.current() >= 0) fit();
    };

    const tick = (now: number) => {
      const m = motion.current;
      const t = tilt.stateRef.current;
      if (touch && !m.leaving) {
        m.auto = false;
        m.target += ((t.value ?? 0.5) - m.target) * 0.05; // smoothed sensor value
        m.fx += (t.fx - m.fx) * 0.08;
        m.fy += (t.fy - m.fy) * 0.08;
        root.style.setProperty('--fx', `${m.fx.toFixed(2)}px`);
        root.style.setProperty('--fy', `${m.fy.toFixed(2)}px`);
      } else if (!m.leaving) {
        if (now - m.lastMove > 3000) m.auto = true;
        if (m.auto) m.target = idleTarget(now);
      } else m.take = Math.min(1, m.take + 0.06);
      m.pos += (m.target - m.pos) * (m.auto && !m.leaving ? 0.04 : touch ? 0.07 : 0.09);

      const mobile = mq.matches;
      const { top, bottom } = seamEdges({ pos: m.pos, mobile, touch, leaving: m.leaving, take: m.take });
      root.style.setProperty('--t', `${top}%`);
      root.style.setProperty('--b', `${bottom}%`);
      for (const line of [seamLine, seamGlow]) {
        line.setAttribute('x1', String(top));
        line.setAttribute('x2', String(bottom));
      }

      if (touch) {
        const fi = fractionalFrame(m.pos, FACE_CENTER, LAST);
        const cur = face.current();
        if (cur < 0 || Math.abs(fi - cur) > 0.7) face.show(Math.round(fi), mobile);
      } else face.show(frameFor(m.pos, FACE_CENTER, LAST), mobile);
      hero.style.setProperty('--px', touch ? '0px' : `${(m.pos - 0.5) * -3}vw`); // on phones Jorge stays centred
      const side = m.leaving || (touch ? '' : activeSide(m.pos, m.auto));
      if (root.dataset.side !== side) root.dataset.side = side;
      raf = requestAnimationFrame(tick);
    };

    let done = 0;
    const total = FACE_FRAMES.length + 1;
    const bump = () => {
      done += 1;
      if (!cancelled) setBootPercent(Math.round((done / total) * 100));
    };
    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(bump, bump);
    Promise.all([face.load(bump), fontsReady, sleep(reduce ? 0 : ENTRY_TIMING.minBootMs)]).then(() => {
      if (cancelled) return;
      fit();
      face.show(FACE_CENTER, mq.matches);
      layout();
      setReady(true);
      raf = requestAnimationFrame(tick);
    });

    const onResize = () => {
      fit();
      requestAnimationFrame(layout);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') setTarget(e.clientX / window.innerWidth);
    };
    const onMouseLeave = () => {
      motion.current.lastMove = 0;
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      face.dispose();
      faceRef.current = null;
    };
    // refs are stable; the loop reads live values from refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createFace, reduce, setTarget, touch]);

  const reset = useCallback(() => {
    const m = motion.current;
    m.leaving = null;
    m.take = 0;
    m.target = 0.5;
    m.lastMove = 0;
    setLeaving(null);
    setWarp((w) => ({ ...w, show: false }));
  }, []);

  /* Back/forward cache: coming back shows the choice again. */
  useEffect(() => {
    const onPageShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) reset();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [reset]);

  const go = useCallback(
    async (side: EntrySide, e?: MouseEvent) => {
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
      }
      const m = motion.current;
      if (m.leaving) return;
      const dest = resolveDestination(side, { isMobile: device.isMobile, forceDesktop: device.forceDesktop });
      m.leaving = side;
      analytics.track({ name: 'choose_side', params: { side } });
      m.take = 0;
      m.target = side === 'red' ? 0 : 1;
      setLeaving(side);
      await sleep(reduce ? 0 : ENTRY_TIMING.leaveDelayMs);
      setWarp({ to: side, show: true, progress: 0 });

      let shown = 0;
      let real = 0;
      const t0 = performance.now();
      // the number moves smoothly and never runs ahead of what was really downloaded
      const anim = window.setInterval(() => {
        shown += (real - shown) * 0.25;
        setWarp((w) => ({ ...w, progress: shown }));
      }, ENTRY_TIMING.warpTickMs);
      const preloader = createPreloader();
      await Promise.race([
        preloader.preload(dest.files.map(withBase), (p) => {
          real = p;
        }),
        sleep(ENTRY_TIMING.preloadTimeoutMs),
      ]);
      real = 1;
      const rest = Math.max(0, ENTRY_TIMING.warpMinMs - (performance.now() - t0));
      await sleep(rest + ENTRY_TIMING.warpHoldMs);
      window.clearInterval(anim);
      setWarp((w) => ({ ...w, progress: 1 }));
      window.location.href = withBase(dest.url);
    },
    [analytics, createPreloader, device.isMobile, device.forceDesktop, reduce],
  );

  const onSideClick = useCallback(
    (side: EntrySide, e: MouseEvent) => {
      // on phones only the buttons navigate: tapping the background is for the gyroscope
      if (!touch) void go(side, e);
    },
    [go, touch],
  );

  const onCtaFocus = useCallback((side: EntrySide) => setTarget(side === 'blue' ? 0.85 : 0.15), [setTarget]);

  return {
    refs,
    bootPercent,
    ready,
    leaving,
    warp,
    tiltPrompt: tilt.prompt,
    requestTilt: tilt.requestPermission,
    debugText: debug ? tilt.debugText : null,
    canAim: input.canAim,
    aiming,
    setAiming,
    go: (side, e) => void go(side, e),
    onSideClick,
    onCtaFocus,
  };
};

export default useEntry;
