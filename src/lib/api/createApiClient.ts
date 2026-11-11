/**
 * Thin HTTP client for the decode9 Worker API. `baseUrl` comes from env.apiUrl and may be empty:
 * then `available` is false and callers degrade (fallback source or "unavailable" result).
 */
export interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  /** Parsed JSON body, or {} when the body is not JSON. */
  data: T;
}

export interface ApiClient {
  readonly available: boolean;
  url: (path: string) => string;
  getJson: <T = unknown>(path: string, init?: RequestInit) => Promise<ApiResponse<T>>;
  /**
   * POSTs JSON as text/plain: a "simple" CORS request, so the browser skips the preflight.
   * The Worker parses the body as JSON regardless of the content type.
   */
  postJson: <T = unknown>(path: string, body: unknown) => Promise<ApiResponse<T>>;
}

export interface ApiClientDeps {
  baseUrl: string;
  fetch: typeof fetch;
}

const parse = async <T>(res: Response): Promise<ApiResponse<T>> => {
  const data = (await res.json().catch(() => ({}))) as T;
  return { status: res.status, ok: res.ok, data };
};

const createApiClient = ({ baseUrl, fetch: doFetch }: ApiClientDeps): ApiClient => {
  const base = baseUrl.trim().replace(/\/+$/, '');
  const url = (path: string) => `${base}/${path.replace(/^\/+/, '')}`;
  return {
    available: base.length > 0,
    url,
    getJson: async (path, init) => parse(await doFetch(url(path), init)),
    postJson: async (path, body) =>
      parse(
        await doFetch(url(path), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify(body),
        }),
      ),
  };
};

export default createApiClient;
