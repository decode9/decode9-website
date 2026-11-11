/** Where a signal was sent from: the desktop terminal («canal») or the mobile transmitter («contacto»). */
export type SignalOrigin = 'escritorio' | 'movil';

/**
 * Body of POST /senal (same fields as the original senal.php).
 * At least one of `email` / `whatsapp` is required. `web` is the honeypot: it must stay empty.
 */
export interface SignalPayload {
  alias: string; // 2–40 chars
  email: string; // ≤120, '' when not given
  whatsapp: string; // ≤40, '' when not given
  msg: string; // ≤500
  origen: SignalOrigin;
  topics?: string[]; // desktop only, ≤10
  lang?: string; // 'es' | 'en'
  web: string; // honeypot
}

export type SignalErrorCode =
  | 'alias'
  | 'correo'
  | 'whatsapp'
  | 'regreso'
  | 'espera'
  | 'almacenamiento'
  | 'net'
  | 'unavailable';

/** `code` is the receipt (`SOS-####`) when ok; an error code otherwise. */
export interface SignalResult {
  ok: boolean;
  code?: string;
  error?: SignalErrorCode;
}

/** Port: sends a contact signal. Adapters never throw; failures come back as `{ ok:false }`. */
export interface SignalGateway {
  send: (payload: SignalPayload) => Promise<SignalResult>;
}
