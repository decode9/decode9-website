import type { SenalRepository } from "../../interfaces/repositories/senal-repository.interface.js";

export const createD1SenalRepository = (db: D1Database): SenalRepository => ({
  async guardar(s) {
    await db
      .prepare(
        `INSERT INTO senales (codigo, fecha, origen, idioma, alias, correo, whatsapp, temas, mensaje, huella)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(s.codigo, s.fecha, s.origen, s.idioma, s.alias, s.correo, s.whatsapp, JSON.stringify(s.temas), s.mensaje, s.huella)
      .run();
  },
});
