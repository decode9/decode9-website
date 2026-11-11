import type { RefObject } from 'react';
import type { NewsItem } from '@/interfaces/news';
import type { WorldTick } from '@/interfaces/profile';

export interface FooterProps {
  /** Footer progress bar width (0–100). */
  progress: number;
  replayDisabled: boolean;
  homeHref: string;
  onReplay: () => void;
  sound: { wanted: boolean; playing: boolean; toggle: () => void; buttonRef: RefObject<HTMLButtonElement> };
  /** Ticker: headlines, or the current world's line while there are none. */
  news: NewsItem[];
  tick: WorldTick;
}
