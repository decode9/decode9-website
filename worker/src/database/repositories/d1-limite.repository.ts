import type { LimiteRepository } from "../../interfaces/repositories/limite-repository.interface.js";

export const createD1LimiteRepository = (db: D1Database): LimiteRepository => ({
  async contarDesde(ambito, huella, desdeSeg) {
    const fila = await db
      .prepare("SELECT COUNT(*) AS n FROM limites WHERE ambito = ? AND huella = ? AND en > ?")
      .bind(ambito, huella, desdeSeg)
      .first<{ n: number }>();
    return fila?.n ?? 0;
  },
  async registrar(ambito, huella, enSeg) {
    await db.prepare("INSERT INTO limites (ambito, huella, en) VALUES (?, ?, ?)").bind(ambito, huella, enSeg).run();
  },
  async purgarAntesDe(antesSeg) {
    await db.prepare("DELETE FROM limites WHERE en <= ?").bind(antesSeg).run();
  },
});
