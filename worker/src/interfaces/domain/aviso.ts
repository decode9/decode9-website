/** Aviso por correo de un envío nuevo. */
export interface Aviso {
  asunto: string;
  texto: string;
  /** Correo del remitente del formulario, para responder directo. */
  responderA?: string;
}
