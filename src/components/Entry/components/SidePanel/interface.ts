import type { MouseEvent } from 'react';
import type { EntrySide } from '@/data/entry';

export interface SidePanelProps {
  side: EntrySide;
  onSelect: (side: EntrySide, e: MouseEvent) => void;
}
