/** Bindings y variables del Worker (wrangler.toml + secretos). */
export interface Bindings {
  DB: D1Database;
  /** Orígenes con CORS, separados por coma. */
  ALLOWED_ORIGINS?: string;
  /** Remitente de los avisos por correo. */
  NOTIFY_FROM?: string;
  /** Secreto: sal del hash de IP. */
  SALT?: string;
  /** Secreto: activa el aviso por Resend (junto con NOTIFY_TO). */
  RESEND_API_KEY?: string;
  /** Secreto: destinatarios del aviso, separados por coma. */
  NOTIFY_TO?: string;
}

export interface AppEnv {
  Bindings: Bindings;
}
