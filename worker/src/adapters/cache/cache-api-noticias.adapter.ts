import type { NoticiasRespuesta } from "../../interfaces/domain/noticia.js";
import type { NoticiasCache } from "../../interfaces/ports/noticias-cache.port.js";

const CLAVE = "https://decode9-api.internal/cache/noticias";
const CABECERA_FECHA = "X-Guardado-En";

/**
 * Caché de borde con la Cache API (`caches.default`). Caduca sola a los `ttlSeg`.
 * Ojo: en `*.workers.dev` la Cache API no guarda nada; ahí manda la copia de D1.
 */
export const createCacheApiNoticias = (cache: Cache | undefined, ttlSeg: number): NoticiasCache => ({
  async leer() {
    const res = await cache?.match(CLAVE);
    if (!res) return null;
    const guardado = Number(res.headers.get(CABECERA_FECHA));
    return { respuesta: await res.json<NoticiasRespuesta>(), guardadoEn: new Date(guardado || 0) };
  },
  async guardar(respuesta, guardadoEn) {
    if (!cache) return;
    const restante = Math.max(1, ttlSeg - Math.floor((Date.now() - guardadoEn.getTime()) / 1000));
    await cache.put(
      CLAVE,
      new Response(JSON.stringify(respuesta), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": `public, max-age=${restante}`,
          [CABECERA_FECHA]: String(guardadoEn.getTime()),
        },
      }),
    );
  },
});
