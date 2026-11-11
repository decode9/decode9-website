import type { ReactNode } from 'react';
import type { CrtSynth } from '@/lib/audio/createCrtSynth';
import type { Bilingual, TerminalLang, TerminalScreenId, TerminalServices } from '@/interfaces/terminal';
import type { WindowManagerApi } from '../useWindowManager';
import type { Cascade } from './cascade';

/** What a screen receives to open its windows (replaces the original globals openWin/ACT/AU/D9USER). */
export interface ScreenContext {
  wm: WindowManagerApi;
  lang: TerminalLang;
  /** Name typed at login (null before login). */
  user: string | null;
  isDesk: () => boolean;
  reduceMotion: boolean;
  go: (id: TerminalScreenId) => void;
  /** Selects a tab of the current screen (original data-tabgo). */
  selectTab: (index: number) => void;
  synth: CrtSynth;
  /** Offset counter shared by detail windows of every screen (original global CASC). */
  cascade: Cascade;
  /** Persists the Sputnik mute choice (d9crt-mute). */
  setMuted: (muted: boolean) => void;
  /** Infrastructure for content screens (posts, signal gateway, QR painter, media analyser), injected by Shell. */
  services: TerminalServices;
}

export interface ScreenDefinition {
  id: TerminalScreenId;
  /** Optional tab row (manifiesto, códice). */
  tabs?: readonly Bilingual[];
  /** Optional content above the desk (original head()). */
  head?: ReactNode;
  /** Opens the screen's windows; `tab` is the selected tab (0 if none). Runs again after login and on tab change. */
  open: (ctx: ScreenContext, tab: number) => void;
}
/** Props of a detail window that shows item `index` of a data list. */
export interface DetailProps {
  index: number;
}

/** Props of a list window: initial selection, what a pick does and the one-shot auto-pick. */
export interface PickerProps {
  onPick: (index: number) => void;
  /** Fires once after the window opens (the original opened the first item after ~260 ms). */
  auto: { delay: number; done: () => void } | null;
}
