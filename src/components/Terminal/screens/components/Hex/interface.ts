import type { TerminalIcon } from '@/interfaces/terminal';

export interface HexProps {
  ic: TerminalIcon;
  /** 84 px instead of 58 px (detail windows). */
  big?: boolean;
  /** Blue frame (Lab branches). */
  blue?: boolean;
  className?: string;
}
