import type { Bilingual, TerminalLang } from '@/interfaces/terminal';

/** Where the menu was opened and on which window (null = desktop). */
export interface ContextMenuTarget {
  x: number;
  y: number;
  uid: number | null;
}

export type ContextAction = 'front' | 'min' | 'close' | 'arrange' | 'cascade' | 'closeall';

export interface ContextMenuItem {
  action: ContextAction;
  label: Bilingual;
  key?: string;
  disabled?: boolean;
}

export interface ContextMenuProps {
  target: ContextMenuTarget;
  /** Window title shown in the header (current language), null for the desktop menu. */
  title: string | null;
  /** First group (window actions); empty for the desktop menu. */
  windowItems: readonly ContextMenuItem[];
  deskItems: readonly ContextMenuItem[];
  closeAllItem: ContextMenuItem;
  /** false while fading out. */
  visible: boolean;
  lang: TerminalLang;
  onAction: (action: ContextAction) => void;
}

export interface UseContextMenuResult {
  ref: React.RefObject<HTMLDivElement>;
  on: boolean;
  pos: { left: number; top: number };
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}
