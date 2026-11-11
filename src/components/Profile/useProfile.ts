import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTERS, CHAPTER_ORDER } from '@/data/profile/chapters';
import { CONTACT_INDEX, D9_INDEX, DIAL_X, STATIONS } from '@/data/profile/stations';
import { WORLDS } from '@/data/profile/worlds';
import type { ChapterId } from '@/interfaces/profile';
import { isNightHour, resolveNightHour, showsNightSimulator } from '@/utils/nightClock';
import useAmbientSound from './hooks/useAmbientSound';
import useD9Jump, { type D9JumpDeps } from './hooks/useD9Jump';
import useNews from './hooks/useNews';
import type {
  ProfileDeps,
  ProfileStageApi,
  ProfileStageBridge,
  StationStatus,
  UseProfileResult,
  WalkieView,
} from './interface';

const NW = WORLDS.length;

/** Readout while the 3D stage is not driving it (no WebGL yet): first phase, 0%. */
export const fallbackStatus = (index: number): StationStatus => {
  const base = { index, progress: 0, replayDisabled: true, done: WORLDS.map(() => false) };
  if (index < NW) return { ...base, name: WORLDS[index].name, phase: `terraformando · ${WORLDS[index].phases[0]}`, pct: '0%', replayDisabled: false };
  if (index > NW) return { ...base, name: 'Averno', phase: 'abriendo decode9', pct: 'd9' };
  return { ...base, name: 'Por descubrir', phase: 'esperando tu idea', pct: '?' };
};

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const here = () => Math.round(window.scrollY / window.innerHeight);

export interface ProfileEnv extends Pick<D9JumpDeps, 'isMobile' | 'navigate' | 'urls' | 'formatWarp' | 'analytics'> {
  deps: ProfileDeps;
}

/** Shared state of /perfil/ (station, chapter, walkie, about, night, sound, decode9 jump) and the stage bridge. */
const useProfile = ({ deps, ...env }: ProfileEnv): UseProfileResult => {
  const stopRefs = useRef<(HTMLElement | null)[]>([]);
  const needleRef = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLElement>(null);
  const refs = {
    moonHit: useRef<HTMLButtonElement>(null),
    sunHit: useRef<HTMLAnchorElement>(null),
    bubble: useRef<HTMLDivElement>(null),
    walkieHint: useRef<HTMLDivElement>(null),
    alarm: useRef<HTMLDivElement>(null),
  };
  const stageApi = useRef<ProfileStageApi | null>(null);
  const [stageReady, setStageReady] = useState(false);

  const [inStop, setInStop] = useState(0);
  const [status, setStatus] = useState<StationStatus>(() => fallbackStatus(0));
  const [chapter, setChapter] = useState<ChapterId>('perfil');
  const [panelOpen, setPanelOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [walkie, setWalkie] = useState<WalkieView>({ open: false, strato: false, shown: false });
  const [asleep, setAsleep] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const news = useNews(deps.newsSource);

  // latest values for the stage loop and stable callbacks
  const live = useRef({ panelOpen, aboutOpen, walkie, asleep, stageReady });
  live.current = { panelOpen, aboutOpen, walkie, asleep, stageReady };

  const isAsleep = useCallback(() => live.current.asleep, []);
  const sound = useAmbientSound(deps.createSound, deps.storage, isAsleep);

  const stopTop = useCallback((i: number) => stopRefs.current[i]?.offsetTop ?? i * window.innerHeight, []);
  const scrollToStop = useCallback((i: number) => {
    const el = stopRefs.current[i];
    if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  }, []);

  /* ---------- ficha de capítulo ---------- */
  const closeChapter = useCallback(() => setPanelOpen(false), []);
  const openChapter = useCallback((id: ChapterId) => {
    if (!CHAPTERS[id]) return;
    setChapter(id);
    setPanelOpen(true);
  }, []);

  /* ---------- walkie ---------- */
  const walkieTimer = useRef<ReturnType<typeof setTimeout>>();
  const openWalkie = useCallback((strato = false) => {
    if (live.current.walkie.open) return;
    setWalkie({ open: true, strato, shown: false });
    if (!live.current.stageReady) {
      // sin escena 3D: la tarjeta aparece tras el vuelo que habría hecho el walkie
      clearTimeout(walkieTimer.current);
      walkieTimer.current = setTimeout(() => setWalkie((w) => (w.open ? { ...w, shown: true } : w)), reduced() ? 0 : strato ? 2000 : 1000);
    }
  }, []);
  const closeWalkie = useCallback(() => {
    clearTimeout(walkieTimer.current);
    setWalkie((w) => (w.open ? { open: false, strato: w.strato, shown: false } : w));
  }, []);
  const walkieFromChapter = useCallback(() => {
    closeChapter();
    setTimeout(() => openWalkie(false), 450);
  }, [closeChapter, openWalkie]);

  /* ---------- decode9 ---------- */
  const d9 = useD9Jump({
    ...env,
    reduceMotion: reduced,
    stopTop,
    scrollToStop,
    preload: deps.preload,
    clearOverlays: () => {
      closeChapter();
      closeWalkie();
    },
  });

  const goTo = useCallback(
    (i: number) => {
      if (i === D9_INDEX && !d9.state.current.ok) {
        d9.ask();
        return;
      }
      scrollToStop(i);
    },
    [d9, scrollToStop],
  );

  const goChapter = useCallback(
    (id: ChapterId) => {
      if (!CHAPTERS[id]) return;
      openChapter(id);
      const wi = CHAPTER_ORDER.indexOf(id);
      if (wi >= 0) scrollToStop(wi);
    },
    [openChapter, scrollToStop],
  );

  const chapterAction = useCallback(
    (action: string) => {
      const [kind, val] = action.split(':');
      if (kind === 'world') {
        closeChapter();
        goTo(Number(val));
      } else if (kind === 'chapter') goChapter(val as ChapterId);
      else if (kind === 'walkie') walkieFromChapter();
    },
    [closeChapter, goChapter, goTo, walkieFromChapter],
  );

  const pressStation = useCallback(
    (w: number) => {
      if (here() === w) {
        if (w === CONTACT_INDEX) openWalkie(false);
        else if (w === D9_INDEX) {
          d9.consent();
          void d9.leave();
        } else openChapter(STATIONS[w].sec as ChapterId);
      } else {
        closeChapter();
        goTo(w);
      }
    },
    [closeChapter, d9, goTo, openChapter, openWalkie],
  );

  const pressStopCta = useCallback(
    (open: ChapterId | 'decode9') => {
      if (open !== 'decode9') openChapter(open);
      else if (here() === D9_INDEX) {
        d9.consent();
        void d9.leave();
      } else goTo(D9_INDEX);
    },
    [d9, goTo, openChapter],
  );

  /* ---------- dial ---------- */
  const dialKey = useRef('');
  const setDial = useCallback((spIn: number, settled: boolean) => {
    const sp = Math.max(0, Math.min(DIAL_X.length - 1, spIn));
    const a = Math.min(DIAL_X.length - 2, Math.floor(sp));
    const f = sp - a;
    if (needleRef.current) needleRef.current.style.left = `${(DIAL_X[a] + (DIAL_X[a + 1] - DIAL_X[a]) * f).toFixed(2)}%`;
    const key = settled ? `s${Math.round(sp)}` : 't';
    if (key === dialKey.current) return;
    dialKey.current = key;
    if (dialRef.current) dialRef.current.toggleAttribute('data-tuning', !settled);
  }, []);

  /* ---------- scroll: parada visible y respaldo sin 3D ---------- */
  useEffect(() => {
    const onScroll = () => {
      const i = here();
      setInStop(i);
      if (live.current.stageReady) return;
      const sp = window.scrollY / window.innerHeight;
      setDial(sp, Math.abs(sp - Math.round(sp)) < 0.03);
      setStatus((s) => (s.index === i ? s : fallbackStatus(Math.max(0, Math.min(D9_INDEX, i)))));
      const st = d9.state.current;
      if (!st.ok && !st.asking && !st.leaving && sp > CONTACT_INDEX + 0.12) d9.ask();
      if (st.ok && !st.leaving && sp < CONTACT_INDEX - 0.25) d9.revoke();
      if (i === D9_INDEX && st.ok && !st.leaving && Math.abs(sp - i) < 0.03) void d9.leave();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [d9, setDial]);

  /* ---------- about, Escape, noche, ?sim=1 ---------- */
  const closeAbout = useCallback(() => {
    if (!live.current.aboutOpen) return;
    setAboutOpen(false);
    refs.moonHit.current?.focus({ preventScroll: true });
  }, [refs.moonHit]);
  const toggleAbout = useCallback(() => (live.current.aboutOpen ? closeAbout() : setAboutOpen(true)), [closeAbout]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeChapter();
      closeAbout();
      closeWalkie();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAbout, closeChapter, closeWalkie]);

  useEffect(() => {
    setShowSim(showsNightSimulator(window.location.search));
  }, []);

  // modo noche al cargar: hora de Argentina (o ?hora=), solo si la página está arriba
  const nightChecked = useRef(false);
  useEffect(() => {
    if (!stageReady || nightChecked.current) return;
    nightChecked.current = true;
    const h = resolveNightHour(window.location.search);
    if (isNightHour(h) && window.scrollY < 10) stageApi.current?.startNight(h);
  }, [stageReady]);

  useEffect(() => {
    const b = document.body;
    b.toggleAttribute('data-p-open', panelOpen);
    b.toggleAttribute('data-asleep', asleep);
    document.documentElement.style.overflow = asleep ? 'hidden' : '';
    return () => {
      b.removeAttribute('data-p-open');
      b.removeAttribute('data-asleep');
      document.documentElement.style.overflow = '';
    };
  }, [panelOpen, asleep]);

  const restart = useCallback(() => {
    stageApi.current?.resetAll();
    closeChapter();
    closeWalkie();
    goTo(0);
  }, [closeChapter, closeWalkie, goTo]);
  const replay = useCallback(() => stageApi.current?.resetWorld(status.index), [status.index]);
  const simulate = useCallback(
    (hour: number) => {
      if (isNightHour(hour)) {
        closeChapter();
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.setTimeout(() => stageApi.current?.startNight(hour), 80);
      } else stageApi.current?.endNight();
    },
    [closeChapter],
  );

  /* ---------- contrato con la escena ---------- */
  const wake = sound.wake;
  const bridge = useMemo<ProfileStageBridge>(
    () => ({
      refs,
      getState: () => ({
        panelOpen: live.current.panelOpen,
        aboutOpen: live.current.aboutOpen,
        walkie: live.current.walkie,
        d9: { ...d9.state.current },
        asleep: live.current.asleep,
        reduceMotion: reduced(),
      }),
      registerApi: (api) => {
        stageApi.current = api;
        setStageReady(Boolean(api));
      },
      onStopProgress: setDial,
      onStatus: setStatus,
      onWalkieShown: () => setWalkie((w) => (w.open ? { ...w, shown: true } : w)),
      openWalkie,
      closeWalkie,
      onAsleep: (on) => {
        setAsleep(on);
        if (!on) wake();
      },
      askD9: d9.ask,
      leaveToD9: () => void d9.leave(),
      revokeD9: d9.revoke,
      goTo,
    }),
    // refs are stable; the callbacks below are stable too (useCallback with stable deps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    bridge,
    stageReady,
    stopRefs,
    needleRef,
    dialRef,
    inStop,
    status,
    chapter,
    panelOpen,
    aboutOpen,
    walkie,
    asleep,
    showSim,
    news,
    sound: { wanted: sound.wanted, playing: sound.playing, toggle: sound.toggle, buttonRef: sound.buttonRef },
    d9: { asking: d9.asking, warpLog: d9.warp, ask: d9.ask, close: d9.close },
    actions: {
      pressStation,
      goTo,
      openChapter,
      goChapter,
      closeChapter,
      chapterAction,
      pressStopCta,
      openWalkie: () => openWalkie(false),
      closeWalkie,
      walkieFromChapter,
      restart,
      replay,
      toggleAbout,
      closeAbout,
      simulate,
    },
  };
};

export default useProfile;
