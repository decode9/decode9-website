import type { NoticiasRespuesta } from "../../interfaces/domain/noticia.js";
import type { NoticiasCache } from "../../interfaces/ports/noticias-cache.port.js";

const CLAVE = "noticias";

/** Copia durable de /noticias en la tabla `cache` (no caduca: sirve de respaldo). */
export const createD1NoticiasCache = (db: D1Database): NoticiasCache => ({
  async leer() {
    const fila = await db
      .prepare("SELECT valor, guardado_en FROM cache WHERE clave = ?")
      .bind(CLAVE)
      .first<{ valor: string; guardado_en: number }>();
    if (!fila) return null;
    return { respuesta: JSON.parse(fila.valor) as NoticiasRespuesta, guardadoEn: new Date(fila.guardado_en) };
  },
  async guardar(respuesta, guardadoEn) {
    await db
      .prepare(
        `INSERT INTO cache (clave, valor, guardado_en) VALUES (?, ?, ?)
         ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor, guardado_en = excluded.guardado_en`,
      )
      .bind(CLAVE, JSON.stringify(respuesta), guardadoEn.getTime())
      .run();
  },
});
