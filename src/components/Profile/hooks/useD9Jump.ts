import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CONTACT_INDEX } from '@/data/profile/stations';
import type { Analytics } from '@/interfaces/analytics';

export interface D9JumpDeps {
  reduceMotion: () => boolean;
  stopTop: (index: number) => number;
  scrollToStop: (index: number) => void;
  /** Closes the chapter panel and the walkie before flying to the Averno. */
  clearOverlays: () => void;
  isMobile: () => boolean;
  preload: (files: readonly string[], onProgress: (p: number) => void) => Promise<void>;
  /** Navigates away (location.href). */
  navigate: (url: string) => void;
  /** Text of the warp terminal for a progress 0–1. */
  formatWarp: (p: number) => string;
  urls: { desktop: string; mobile: string; desktopAssets: readonly string[] };
  /** Records the jump to decode9 (`d9_jump`). */
  analytics: Analytics;
}

const WARP_TIMEOUT = 8000;
const WARP_MIN = 1000;

/**
 * decode9 jump: before flying to the fire planet the visitor is asked; on "yes" Jorge flies there
 * and, once settled, a red warp screen shows the real download progress and opens decode9
 * (/decode9/movil/ on phones).
 */
const useD9Jump = (deps: D9JumpDeps) => {
  const depsRef = useRef(deps);
  depsRef.current = deps;
  const state = useRef({ ok: false, asking: false, leaving: false });
  const returnFocus = useRef<HTMLElement | null>(null);
  const [asking, setAsking] = useState(false);
  const [warp, setWarp] = useState<string | null>(null);

  const ask = useCallback(() => {
    const s = state.current;
    if (s.asking || s.leaving) return;
    s.asking = true;
    const d = depsRef.current;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const back = window.scrollY > d.stopTop(CONTACT_INDEX) + 4;
    if (back) window.scrollTo({ top: d.stopTop(CONTACT_INDEX), behavior: d.reduceMotion() ? 'auto' : 'smooth' });
    // se bloquea el scroll detrás del diálogo cuando ya volvió al contacto
    setTimeout(
      () => {
        if (state.current.asking) document.documentElement.style.overflow = 'hidden';
      },
      back && !d.reduceMotion() ? 650 : 0,
    );
    setAsking(true);
  }, []);

  const close = useCallback((go: boolean) => {
    const s = state.current;
    if (!s.asking) return;
    s.asking = false;
    setAsking(false);
    document.documentElement.style.overflow = '';
    if (go) {
      s.ok = true;
      depsRef.current.clearOverlays();
      setTimeout(() => depsRef.current.scrollToStop(CONTACT_INDEX + 1), 30);
    } else {
      returnFocus.current?.focus?.({ preventScroll: true });
    }
  }, []);

  const leave = useCallback(async () => {
    const s = state.current;
    if (s.leaving) return;
    s.leaving = true;
    const d = depsRef.current;
    d.analytics.track({ name: 'd9_jump' });
    const mobile = d.isMobile();
    const url = mobile ? d.urls.mobile : d.urls.desktop;
    const files = mobile ? [url] : [url, ...d.urls.desktopAssets];
    let real = 0;
    let shown = 0;
    setWarp(d.formatWarp(0));
    const anim = setInterval(() => {
      shown += (real - shown) * 0.25;
      setWarp(d.formatWarp(shown));
    }, 50);
    const t0 = performance.now();
    await Promise.race([
      d.preload(files, (p) => {
        real = p;
      }),
      new Promise((r) => setTimeout(r, WARP_TIMEOUT)),
    ]);
    real = 1;
    await new Promise((r) => setTimeout(r, Math.max(0, WARP_MIN - (performance.now() - t0)) + 250));
    clearInterval(anim);
    setWarp(d.formatWarp(1));
    d.navigate(url);
  }, []);

  const consent = useCallback(() => {
    state.current.ok = true;
  }, []);
  const revoke = useCallback(() => {
    state.current.ok = false;
  }, []);

  // back/forward cache: coming back from decode9 resets the jump and lands on the contact
  useEffect(() => {
    const onShow = (ev: PageTransitionEvent) => {
      if (!ev.persisted) return;
      state.current.leaving = false;
      state.current.ok = false;
      setWarp(null);
      depsRef.current.scrollToStop(CONTACT_INDEX);
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  return useMemo(
    () => ({ state, asking, warp, ask, close, leave, consent, revoke }),
    [asking, warp, ask, close, leave, consent, revoke],
  );
};

export default useD9Jump;
