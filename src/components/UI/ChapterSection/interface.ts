import type { ReactNode } from 'react';
import type { ChapterId } from '@/interfaces';

export interface ChapterSectionProps {
  id: ChapterId;
  /** HUD code, e.g. "02". */
  code: string;
  label: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  /** Darkens the stage behind the copy (`side`) or behind all of it (`full`). */
  veil?: 'side' | 'full';
  /**
   * On the horizontal tour: `screen` is one viewport wide, `wide` grows with
   * its content (a row of columns). Vertical layouts ignore it.
   */
  layout?: 'screen' | 'wide';
}
