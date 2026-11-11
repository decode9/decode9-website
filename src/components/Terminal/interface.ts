import type { CSSProperties, RefObject } from 'react';
import type { KeyValueStorage } from '@/interfaces/storage';
import type { TerminalLang, TerminalScreenId, TerminalServices, WireTarget } from '@/interfaces/terminal';
import type { CrtSynth } from '@/lib/audio/createCrtSynth';
import type { WireLogo, WireLogoDeps } from '@/lib/canvas/wireLogo';
import type { AssemblyPlan } from './assembly';
import type { WindowManagerApi } from './useWindowManager';

/** Props of <Terminal /> (route /decode9/). */
export type TerminalProps = Record<string, never>;

/** Infrastructure injected by the composition root (components/Shell). */
export interface TerminalDeps {
  storage: KeyValueStorage;
  createSynth: (muted: boolean) => CrtSynth;
  createWireLogo: (deps: WireLogoDeps) => WireLogo;
  /** Handed to every screen as ScreenContext.services. */
  services: TerminalServices;
}

/**
 * Life-cycle of the shell: `pre` (empty system behind the login), `asm` (pieces assembling after
 * login, original .crt.asm) and `live`.
 */
export type ShellPhase = 'pre' | 'asm' | 'live';

/** Inline CSS variables of an assembling piece (--d delay, --px slide). Empty outside `asm`. */
export type PieceStyle = CSSProperties & { '--d'?: string; '--px'?: string };

export interface UseTerminalResult {
  lang: TerminalLang;
  setLang: (lang: TerminalLang) => void;
  crtOn: boolean;
  toggleCrt: () => void;
  phase: ShellPhase;
  /** Assembly timeline while phase === 'asm' (null otherwise). */
  assembly: AssemblyPlan | null;
  user: string | null;
  screen: TerminalScreenId;
  /** True for the 240 ms the current screen is leaving (original .scr.out). */
  screenLeaving: boolean;
  /** Bumped on every screen change (background glyph swap, decode effects). */
  screenVersion: number;
  tab: number;
  wireTarget: WireTarget;
  flashOn: boolean;
  loginVisible: boolean;
  welcomeName: string | null;
  poweringOff: boolean;
  logoHidden: boolean;
  reduceMotion: boolean;
  wm: WindowManagerApi;
  synth: CrtSynth;
  deskRef: RefObject<HTMLDivElement>;
  stageRef: RefObject<HTMLElement>;
  navRef: RefObject<HTMLElement>;
  logoRef: RefObject<HTMLSpanElement>;
  go: (id: TerminalScreenId) => void;
  selectTab: (index: number) => void;
  /** Login callbacks (timeline of the original enterOS). */
  onPrime: () => void;
  onAuthorized: (name: string) => void;
  onGateOpen: () => void;
  onLoginDone: () => void;
  onWelcome: (name: string) => void;
  onWelcomeClosed: () => void;
  setLogoHidden: (hidden: boolean) => void;
  exit: () => void;
  setMuted: (muted: boolean) => void;
}
