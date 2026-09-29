import type { ChapterId } from '@/interfaces';

export interface ChapterRailProps {
  label: string;
  activeChapter: ChapterId;
  names: Record<ChapterId, string>;
  onSelect: (id: ChapterId) => void;
}
