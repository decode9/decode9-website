import type { ChapterId, Station } from '@/interfaces/profile';

export interface StopProps {
  index: number;
  station: Station;
  /** In view: the headline words rise and gain weight. */
  active: boolean;
  stopRef: (el: HTMLElement | null) => void;
  onCta: (open: ChapterId | 'decode9') => void;
}

export interface HeadlineWord {
  word: string;
  acc: boolean;
  delay: string;
}
