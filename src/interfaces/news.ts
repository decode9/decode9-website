/** A tech headline for the profile ticker (shape of GET /noticias → { noticias: NewsItem[] }). */
export interface NewsItem {
  cat: string;
  fuente: string;
  titulo: string;
  url: string;
  /** ISO date; absent in the Hacker News browser fallback. */
  fecha?: string;
}

/** Port: loads headlines (worker first, Hacker News fallback). Never throws; [] when nothing loads. */
export interface NewsSource {
  load: () => Promise<NewsItem[]>;
}
