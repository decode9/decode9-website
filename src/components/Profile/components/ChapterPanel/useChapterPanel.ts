import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const TAN = Math.tan((35 * Math.PI) / 180);
const GAP = 30;

interface Geo {
  w: number;
  hw: number;
  k: number;
  L0: number;
  W: number;
  pad: number;
  gap: number;
}

/**
 * Geometry of the 35° glass panel: the diagonal line is the panel edge; items slide down that
 * diagonal resting on it by their bottom corner (layoutPanel/placeItems of the original).
 */
const useChapterPanel = (open: boolean, chapter: string) => {
  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const geo = useRef<Geo>({ w: 0, hw: 0, k: TAN, L0: 0, W: 0, pad: 28, gap: GAP });
  const [fits, setFits] = useState(false);
  const edge = (y: number) => geo.current.L0 + y * geo.current.k;

  const placeItems = useCallback(() => {
    const { W, w, hw, pad, gap } = geo.current;
    const track = trackRef.current;
    if (!track) return;
    Array.from(track.children).forEach((node) => {
      const el = node as HTMLElement;
      const r = el.getBoundingClientRect();
      const hero = el.dataset.hero !== undefined;
      const ew = hero ? hw : w;
      const x = Math.max(pad, Math.min(edge(r.bottom) + gap, W - ew - pad));
      el.style.transform = `translateX(${x.toFixed(1)}px)`;
      if (!hero) el.style.setProperty('--nx', `${Math.min(0, edge(r.top + r.height / 2) - x).toFixed(1)}px`);
    });
  }, []);

  const layout = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const W = panel.clientWidth;
    const H = panel.clientHeight;
    const narrow = W <= 720;
    const pad = narrow ? 14 : 32;
    const gap = narrow ? 14 : GAP;
    const w = narrow ? W - pad * 2 - 64 : Math.round(Math.min(580, Math.max(340, W * 0.4)));
    const room = Math.max(0, W - w - pad * 2 - gap);
    const k = Math.min(TAN, room / H);
    const L0 = pad + (room - H * k) / 2;
    const hw = Math.round(Math.max(280, Math.min(780, W - pad - (L0 + H * k * 0.62) - gap)));
    geo.current = { W, w, hw, k, L0, pad, gap };
    const set = (n: string, v: string) => panel.style.setProperty(n, v);
    set('--w', `${w}px`);
    set('--hw', `${hw}px`);
    set('--e0', `${L0.toFixed(1)}px`);
    set('--e1', `${(L0 + H * k).toFixed(1)}px`);
    set('--rx', `${edge(H / 2).toFixed(1)}px`);
    set('--ang', `${((Math.atan(k) * 180) / Math.PI).toFixed(2)}deg`);
    set('--tagx', `${Math.max(narrow ? 28 : 230, edge(60) + 28).toFixed(0)}px`);
    setFits(edge(H - 80) > 230);
    placeItems();
  }, [placeItems]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    layout();
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(t);
  }, [open, chapter, layout]);

  useEffect(() => {
    if (!open) return undefined;
    let placing = false;
    const onScroll = () => {
      if (placing) return;
      placing = true;
      requestAnimationFrame(() => {
        placing = false;
        placeItems();
      });
    };
    const el = scrollRef.current;
    el?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', layout);
    return () => {
      el?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', layout);
    };
  }, [open, layout, placeItems]);

  return { panelRef, scrollRef, trackRef, closeRef, fits };
};

export default useChapterPanel;
