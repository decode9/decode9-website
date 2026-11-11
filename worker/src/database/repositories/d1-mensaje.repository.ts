import type { Mensaje } from "../../interfaces/domain/mensaje.js";
import type { MensajeRepository } from "../../interfaces/repositories/mensaje-repository.interface.js";

export const createD1MensajeRepository = (db: D1Database): MensajeRepository => ({
  async guardar(m: Mensaje) {
    await db
      .prepare("INSERT INTO mensajes (fecha, idioma, texto, correo, numero, huella) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(m.fecha, m.idioma, m.texto, m.correo, m.numero, m.huella)
      .run();
  },
});
