import type { Bilingual, TerminalIcon } from '@/interfaces/terminal';

export interface SlotItem {
  ic: TerminalIcon;
  label: Bilingual;
}

export interface SlotRowProps {
  items: readonly SlotItem[];
  selected: number;
  onPick: (index: number) => void;
  /** Two columns with blue hexes and no number (Lab branches, original .slots.two). */
  two?: boolean;
}
