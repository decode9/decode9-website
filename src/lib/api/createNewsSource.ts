import type { NewsItem, NewsSource } from '@/interfaces/news';
import type { ApiClient } from './createApiClient';

export const HN_FALLBACK_URL = 'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=14';
/** The ticker shows at most this many headlines from the Worker. */
export const MAX_NEWS = 22;

interface NewsAnswer {
  ok?: boolean;
  actualizado?: string;
  noticias?: NewsItem[];
}

interface HnAnswer {
  hits?: { title?: string; url?: string | null; objectID: string }[];
}

export interface NewsSourceDeps {
  client: ApiClient;
  fetch: typeof fetch;
}

/**
 * Adapter of the NewsSource port: GET {apiUrl}/noticias first (php.net, CoinDesk, HN, Ars, TechCrunch
 * aggregated by the Worker); if that fails or is empty, Hacker News front page straight from the browser.
 */
const createNewsSource = ({ client, fetch: doFetch }: NewsSourceDeps): NewsSource => {
  const fromWorker = async (): Promise<NewsItem[]> => {
    if (!client.available) return [];
    try {
      const { data } = await client.getJson<NewsAnswer>('noticias', { cache: 'no-store' });
      return data?.noticias?.length ? data.noticias.slice(0, MAX_NEWS) : [];
    } catch {
      return [];
    }
  };

  const fromHackerNews = async (): Promise<NewsItem[]> => {
    try {
      const res = await doFetch(HN_FALLBACK_URL);
      const data = (await res.json()) as HnAnswer;
      return (data.hits ?? [])
        .filter((h) => h.title)
        .map((h) => ({
          cat: 'Dev',
          fuente: 'Hacker News',
          titulo: h.title as string,
          url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        }));
    } catch {
      return [];
    }
  };

  return {
    load: async () => {
      const news = await fromWorker();
      return news.length ? news : fromHackerNews();
    },
  };
};

export default createNewsSource;
