/**
 * Public runtime configuration. NEXT_PUBLIC_* values are inlined at build time
 * only when accessed literally. An empty API URL is allowed: the adapters then
 * fall back (e.g. news from Hacker News) or report the channel as unavailable.
 */
export interface PublicEnv {
  apiUrl: string;
}

export const readEnv = (raw: { apiUrl?: string } = { apiUrl: process.env.NEXT_PUBLIC_API_URL }): PublicEnv => ({
  apiUrl: (raw.apiUrl ?? '').trim().replace(/\/+$/, ''),
});

export const env: PublicEnv = readEnv();
