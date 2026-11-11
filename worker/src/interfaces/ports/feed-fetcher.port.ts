export interface FeedFetcher {
  /** Cuerpo de la respuesta o null si la fuente falla (red, tiempo o HTTP >= 400). */
  traer(url: string): Promise<string | null>;
}
