'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MENU, SCREEN_IDS, TERMINAL_STORAGE, TERMINAL_URLS, WIRE_TARGETS } from '@/data/terminal';
import useDevice, { shouldUseMobile } from '@/hooks/useDevice';
import useHashRoute, { readHashRoute } from '@/hooks/useHashRoute';
import type { TerminalScreenId } from '@/interfaces/terminal';
import { decodeText } from '@/utils/decodeText';
import { planAssembly, type AssemblyPlan } from './assembly';
import createCascade from './screens/cascade';
import type { ShellPhase, TerminalDeps, UseTerminalResult } from './interface';
import type { ScreenContext } from './screens/interface';
import { SCREENS } from './screens/registry';
import useTerminalLang from './useTerminalLang';
import useWindowManager from './useWindowManager';

/** Number of HUD pieces that assemble (original .hudr > *: two boxes, mini-map, status box). */
const HUD_PIECES = 4;

/** Root state of the terminal: routing, login timeline, assembly, CRT, keyboard and screen registry. */
const useTerminal = ({ storage, createSynth, services }: TerminalDeps): UseTerminalResult => {
  const { reduceMotion } = useDevice();
  const { lang, setLang: storeLang } = useTerminalLang(storage);
  const route = useHashRoute(SCREEN_IDS, 'home');

  const deskRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const wm = useWindowManager(deskRef, reduceMotion);
  const cascade = useMemo(createCascade, []);

  const synth = useMemo(() => createSynth(storage.get(TERMINAL_STORAGE.mute) === '1'), [createSynth, storage]);
  useEffect(() => () => synth.dispose(), [synth]);

  const [crtOn, setCrtOn] = useState(true);
  const [phase, setPhase] = useState<ShellPhase>('pre');
  const [assembly, setAssembly] = useState<AssemblyPlan | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [screen, setScreen] = useState<TerminalScreenId>('home');
  const [screenLeaving, setScreenLeaving] = useState(false);
  const [screenVersion, setScreenVersion] = useState(0);
  const [tabs, setTabs] = useState<Partial<Record<TerminalScreenId, number>>>({});
  const [flashOn, setFlashOn] = useState(false);
  const [loginVisible, setLoginVisible] = useState(true);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const [poweringOff, setPoweringOff] = useState(false);
  const [logoHidden, setLogoHidden] = useState(false);

  // Latest values for timers and listeners (the original read globals).
  const live = useRef({ screen, user, tabs, lang, reduceMotion, loginVisible, welcomeName });
  live.current = { screen, user, tabs, lang, reduceMotion, loginVisible, welcomeName };
  const started = useRef(false);
  const timers = useRef<number[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const setMuted = useCallback(
    (muted: boolean) => {
      synth.setMuted(muted);
      storage.set(TERMINAL_STORAGE.mute, muted ? '1' : '0');
    },
    [storage, synth],
  );

  /* Screen context handed to the registry (replaces the original globals openWin/ACT/AU/D9USER). */
  const ctxRef = useRef<ScreenContext | null>(null);
  const runScreen = useCallback((id: TerminalScreenId, tab?: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    SCREENS[id].open(ctx, tab ?? live.current.tabs[id] ?? 0);
  }, []);

  const flash = useCallback(() => {
    setFlashOn(true);
    later(() => setFlashOn(false), 90);
  }, [later]);

  const go = useCallback(
    (id: TerminalScreenId) => {
      if (!MENU.some((m) => m.id === id)) return;
      const make = () => {
        setScreenLeaving(false);
        wm.clear();
        if (id !== 'home') synth.stop();
        setScreen(id);
        live.current.screen = id;
        setScreenVersion((v) => v + 1);
        route.write(id);
        requestAnimationFrame(() => runScreen(id));
      };
      if (started.current && !live.current.reduceMotion) {
        setScreenLeaving(true);
        flash();
        later(make, 240);
      } else make();
      started.current = true;
    },
    [flash, later, route, runScreen, synth, wm],
  );

  const selectTab = useCallback(
    (index: number) => {
      const id = live.current.screen;
      const count = SCREENS[id].tabs?.length ?? 0;
      if (!count) return;
      const i = (index + count) % count;
      setTabs((t) => ({ ...t, [id]: i }));
      live.current.tabs = { ...live.current.tabs, [id]: i };
      wm.clear();
      later(() => runScreen(id, i), live.current.reduceMotion ? 0 : 200);
    },
    [later, runScreen, wm],
  );

  ctxRef.current = {
    wm,
    lang,
    user,
    isDesk: wm.isDesk,
    reduceMotion,
    go,
    selectTab,
    synth,
    cascade,
    setMuted,
    services,
  };

  /* Boot: phone redirect, legacy key, CRT preference, first screen from the hash. */
  useEffect(() => {
    if (shouldUseMobile()) {
      window.location.replace(TERMINAL_URLS.mobileUrl + window.location.hash);
      return;
    }
    storage.remove(TERMINAL_STORAGE.legacyUser);
    setCrtOn(storage.get(TERMINAL_STORAGE.crt) !== 'off');
    go(readHashRoute(SCREEN_IDS, 'home'));
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = window.innerWidth > 900 ? 'hidden' : 'auto';
    return () => {
      body.style.overflow = prev;
    };
    // Boot runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCrt = useCallback(() => {
    setCrtOn((on) => {
      storage.set(TERMINAL_STORAGE.crt, on ? 'off' : 'on');
      return !on;
    });
  }, [storage]);

  const setLang = useCallback(
    (next: typeof lang) => {
      storeLang(next);
      decodeText(stageRef.current, 600, { reduceMotion });
    },
    [reduceMotion, storeLang],
  );

  /* Post-login assembly (original assemble()). */
  const onGateOpen = useCallback(() => {
    const plan = planAssembly(MENU.length, HUD_PIECES, live.current.reduceMotion);
    setAssembly(plan);
    setPhase('asm');
    later(() => {
      wm.clear();
      later(() => runScreen(live.current.screen), live.current.reduceMotion ? 0 : 60);
    }, plan.total);
    later(() => {
      setPhase('live');
      setAssembly(null);
    }, plan.total + 700);
  }, [later, runScreen, wm]);

  const onAuthorized = useCallback(
    (name: string) => {
      setUser(name);
      live.current.user = name;
    },
    [],
  );

  const onPrime = useCallback(() => {
    if (!synth.muted) synth.prime();
  }, [synth]);

  const onWelcomeClosed = useCallback(() => {
    setWelcomeName(null);
    const nav = navRef.current;
    const target = nav?.querySelector<HTMLElement>('[aria-current="page"]') ?? nav?.querySelector<HTMLElement>('button');
    target?.focus({ preventScroll: true });
  }, []);

  const exit = useCallback(() => {
    synth.stop();
    setPoweringOff(true);
    later(() => {
      window.location.href = TERMINAL_URLS.portalUrl;
    }, reduceMotion ? 0 : 800);
  }, [later, reduceMotion, synth]);

  /* Keyboard: ←/→ change tabs, Escape closes the top window or returns home (original keydown). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { loginVisible: lv, welcomeName: wn, screen: cur } = live.current;
      if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? '') || lv || wn) return;
      const target = e.target as Element | null;
      const inNavOrWin = !!target?.closest?.('[data-terminal-nav],[data-terminal-win]');
      if (SCREENS[cur].tabs && !e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !inNavOrWin) {
        e.preventDefault();
        selectTab((live.current.tabs[cur] ?? 0) + (e.key === 'ArrowRight' ? 1 : -1));
        return;
      }
      if (e.key === 'Escape' && cur !== 'home') {
        const top = wm.windows.find((w) => w.uid === wm.topUid);
        if (top && !top.spec.base) {
          wm.close(top.uid);
          return;
        }
        e.preventDefault();
        go('home');
        navRef.current?.querySelector<HTMLElement>('button')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, selectTab, wm]);

  return {
    lang,
    setLang,
    crtOn,
    toggleCrt,
    phase,
    assembly,
    user,
    screen,
    screenLeaving,
    screenVersion,
    tab: tabs[screen] ?? 0,
    wireTarget: WIRE_TARGETS[screen],
    flashOn,
    loginVisible,
    welcomeName,
    poweringOff,
    logoHidden,
    reduceMotion,
    wm,
    synth,
    deskRef,
    stageRef,
    navRef,
    logoRef,
    go,
    selectTab,
    onPrime,
    onAuthorized,
    onGateOpen,
    onLoginDone: () => setLoginVisible(false),
    onWelcome: setWelcomeName,
    onWelcomeClosed,
    setLogoHidden,
    exit,
    setMuted,
  };
};

export default useTerminal;
