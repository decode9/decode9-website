import type { FeedFetcher } from "../../interfaces/ports/feed-fetcher.port.js";

const TIEMPO_MS = 6_000;
const AGENTE = "Mozilla/5.0 (decode9-api noticias)";

/** Lee una fuente pública con tiempo límite; cualquier fallo devuelve null. */
export const createFetchFeed = (fetcher: typeof fetch = fetch): FeedFetcher => ({
  async traer(url) {
    try {
      const res = await fetcher(url, {
        headers: { "User-Agent": AGENTE, Accept: "application/rss+xml, application/atom+xml, application/json, */*" },
        redirect: "follow",
        signal: AbortSignal.timeout(TIEMPO_MS),
      });
      return res.ok ? await res.text() : null;
    } catch {
      return null;
    }
  },
});
