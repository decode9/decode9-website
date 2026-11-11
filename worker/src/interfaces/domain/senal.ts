export type OrigenSenal = "movil" | "escritorio";

/** Señal del transmisor ya validada y limpia. */
export interface Senal {
  codigo: string;
  fecha: string;
  origen: OrigenSenal;
  idioma: string;
  alias: string;
  correo: string;
  whatsapp: string;
  temas: string[];
  mensaje: string;
  huella: string;
}

export interface SenalRespuesta {
  ok: true;
  code: string;
}
