import type { Bilingual } from '@/interfaces/terminal';

export interface ListMenuItem {
  /** Left code (number, channel…). */
  lead: string;
  label: string | Bilingual;
  /** Right code. */
  tail: string | Bilingual;
}

export interface ListMenuProps {
  items: readonly ListMenuItem[];
  /** Selected index; -1 for none. */
  selected: number;
  onPick: (index: number) => void;
  /** Extra faded row with a glitching label (Archive · Wow!). */
  ghost?: ListMenuItem & { selected: boolean; onPick: () => void };
}
