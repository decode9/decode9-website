import type { Mensaje } from "../domain/mensaje.js";

export interface MensajeRepository {
  guardar(mensaje: Mensaje): Promise<void>;
}
