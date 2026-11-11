import type { NewsItem } from '@/interfaces/news';
import type { WorldTick } from '@/interfaces/profile';

export interface NewsTickerProps {
  news: NewsItem[];
  tick: WorldTick;
}
