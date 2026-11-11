import type { RefObject } from 'react';
import type { TerminalLang } from '@/interfaces/terminal';
import type { WindowState } from '../../../../useWindowManager';

export interface WindowProps {
  win: WindowState;
  /** Top-most live window (.wtop). */
  top: boolean;
  /** Desk is re-arranging (clears user-resized heights, original arrangeWins). */
  arranging: boolean;
  lang: TerminalLang;
  reduceMotion: boolean;
  deskRef: RefObject<HTMLDivElement>;
  isDesk: () => boolean;
  onFront: (uid: number) => void;
  onClose: (uid: number) => void;
  onMin: (uid: number, on: boolean) => void;
  onMove: (uid: number, left: number, top: number) => void;
}

export interface UseWindowResult {
  rootRef: RefObject<HTMLDivElement>;
  titleRef: RefObject<HTMLSpanElement>;
  bodyRef: RefObject<HTMLDivElement>;
  dragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onBarPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onBarPointerUp: () => void;
  onBarClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
