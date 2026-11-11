import type { Chapter, ChapterId } from '@/interfaces/profile';

export interface ProfileChaptersProps {
  chapters: Record<ChapterId, Chapter>;
  order: readonly ChapterId[];
  /** Headline without accents (plainText of data/profile). */
  toText: (rich: Chapter['title']) => string;
}
