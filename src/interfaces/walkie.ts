/** Body of POST /walkie (same fields as the original mensaje.php). `web` is the honeypot. */
export interface WalkiePayload {
  texto: string; // ≥3 chars
  web: string;
  lang: string;
}

/**
 * Outcome of a walkie message, mapped from the HTTP answer:
 *  ok → 200 + {ok:true} · rate-limited → 429 · empty → {error:'vacio'}
 *  unavailable → no API URL configured · failed → network or any other error
 */
export type WalkieStatus = 'ok' | 'rate-limited' | 'empty' | 'unavailable' | 'failed';

export interface WalkieResult {
  status: WalkieStatus;
}

/** Port: sends a walkie message from the profile. Never throws. */
export interface WalkieGateway {
  send: (payload: WalkiePayload) => Promise<WalkieResult>;
}
