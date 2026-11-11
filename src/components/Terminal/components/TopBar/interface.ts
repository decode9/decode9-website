import type { CSSProperties, RefObject } from 'react';
import type { TerminalLang } from '@/interfaces/terminal';

export interface TopBarProps {
  user: string | null;
  lang: TerminalLang;
  onLang: (lang: TerminalLang) => void;
  crtOn: boolean;
  onToggleCrt: () => void;
  onExit: () => void;
  /** Landing spot of the login emblem flight. */
  logoRef: RefObject<HTMLSpanElement>;
  logoHidden: boolean;
  reduceMotion: boolean;
  /** Assembly variables (--d/--px). */
  style?: CSSProperties;
}

export interface TopBarLive {
  clock: string;
  glyph: string;
  /** SYNC percentage of the load bar. */
  sync: number;
  /** Opacity of each of the 6 signal bars (shared with the HUD in part B). */
  signal: number[];
}
