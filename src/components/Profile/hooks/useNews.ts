import { useEffect, useState } from 'react';
import type { NewsItem, NewsSource } from '@/interfaces/news';

/** Headlines for the footer ticker, loaded once (Worker first, Hacker News fallback). */
const useNews = (source: NewsSource): NewsItem[] => {
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => {
    let alive = true;
    void source.load().then((items) => {
      if (alive) setNews(items);
    });
    return () => {
      alive = false;
    };
  }, [source]);
  return news;
};

export default useNews;
