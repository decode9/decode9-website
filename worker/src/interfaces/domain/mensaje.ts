/** Mensaje del walkie del perfil, con el contacto detectado en el texto. */
export interface Mensaje {
  fecha: string;
  idioma: string;
  texto: string;
  correo: string;
  numero: string;
  huella: string;
}

export interface MensajeRespuesta {
  ok: true;
}
