import type { Bilingual } from '@/interfaces/terminal';

export interface ScreenTabsProps {
  tabs: readonly Bilingual[];
  selected: number;
  onSelect: (index: number) => void;
  /** Bumped on screen change: re-decodes the row (original decodeText(.tabs, 600)). */
  screenVersion: number;
  reduceMotion: boolean;
}
