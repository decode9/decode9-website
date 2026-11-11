export interface ContactFields {
  alias: string;
  regreso: string;
  msg: string;
  /** Honeypot: must stay empty. */
  web: string;
}

export interface ContactErrors {
  alias: boolean;
  regreso: boolean;
}

/** Receipt shown after a signal goes out (#ok). */
export interface ContactReceipt {
  code: string;
  /** "HH:MM · VÍA CORREO|WHATSAPP" */
  meta: string;
  alias: string;
}
