import type { CSSProperties, RefObject } from 'react';
import type { TerminalLang, TerminalScreenId } from '@/interfaces/terminal';
import type { WindowManagerApi } from '../../useWindowManager';
import type { ContextAction, ContextMenuItem, ContextMenuTarget } from './components/ContextMenu/interface';

export interface StageProps {
  stageRef: RefObject<HTMLElement>;
  deskRef: RefObject<HTMLDivElement>;
  wm: WindowManagerApi;
  screen: TerminalScreenId;
  /** Bumped on every screen change (CRT-in animation, tab decode). */
  screenVersion: number;
  /** Old screen fading out (CRT-out animation). */
  leaving: boolean;
  tab: number;
  selectTab: (index: number) => void;
  lang: TerminalLang;
  reduceMotion: boolean;
  /** Assembly variables (--d) of the stage. */
  style?: CSSProperties;
}

export interface StageMenu {
  target: ContextMenuTarget;
  title: string | null;
  windowItems: ContextMenuItem[];
  deskItems: ContextMenuItem[];
  closeAllItem: ContextMenuItem;
  visible: boolean;
}

export interface UseStageResult {
  entering: boolean;
  menu: StageMenu | null;
  onContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
  onMenuAction: (action: ContextAction) => void;
}
