import type { ChapterId } from '@/interfaces/profile';

export interface ChapterPanelProps {
  chapter: ChapterId;
  open: boolean;
  onClose: () => void;
  onNext: (id: ChapterId) => void;
  /** CTA with data-act ('world:N' | 'chapter:id' | 'walkie'). */
  onAction: (action: string) => void;
  onWalkie: () => void;
}
