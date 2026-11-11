import type { RefObject } from 'react';
import type { TerminalScreenId } from '@/interfaces/terminal';
import type { AssemblyPlan } from '../../assembly';

export interface MainNavProps {
  /** Kept on the <nav>: the wire logo dodges its box. */
  navRef: RefObject<HTMLElement>;
  current: TerminalScreenId;
  go: (id: TerminalScreenId) => void;
  /** Post-login assembly plan (menu[i] and navfoot delays), null outside the assembly. */
  assembly: AssemblyPlan | null;
  reduceMotion: boolean;
}

export interface UseMainNavResult {
  listRef: RefObject<HTMLUListElement>;
  onListKeyDown: (e: React.KeyboardEvent<HTMLUListElement>) => void;
}
