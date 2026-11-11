import type { Aviso } from "../domain/aviso.js";

/** Aviso fuera de banda (correo). Puede fallar: quien lo llama no debe depender de él. */
export interface Notifier {
  notificar(aviso: Aviso): Promise<void>;
}
