import type { FuenteNoticias, NoticiasRespuesta } from "../../interfaces/domain/noticia.js";
import type { Clock } from "../../interfaces/ports/clock.interface.js";
import type { FeedFetcher } from "../../interfaces/ports/feed-fetcher.port.js";
import type { NoticiasCache } from "../../interfaces/ports/noticias-cache.port.js";
import { parsearFeed } from "../../utils/feeds/parse-feed.util.js";
import { isoSegundos } from "../../utils/shared/fecha.util.js";
import { intercalarPorCategoria, seleccionarDeFuente } from "./rankear-noticias.js";

export interface ObtenerNoticiasDeps {
  fuentes: readonly FuenteNoticias[];
  claves: readonly string[];
  feeds: FeedFetcher;
  /** Caché de borde (Cache API): solo devuelve copias frescas. */
  cacheRapida: NoticiasCache;
  /** Caché durable (D1): copia fresca si tiene menos de `frescuraMs`, respaldo viejo si todo falla. */
  cacheDurable: NoticiasCache;
  clock: Clock;
  frescuraMs: number;
}

export interface ObtenerNoticias {
  ejecutar(): Promise<NoticiasRespuesta>;
}

/** Un fallo de caché nunca rompe /noticias: se registra y se sigue como si no hubiera copia. */
const sinFallar = async <T>(operacion: () => Promise<T>): Promise<T | null> => {
  try {
    return await operacion();
  } catch (err) {
    console.error("Caché de noticias:", err instanceof Error ? err.message : err);
    return null;
  }
};

/** GET /noticias · port de `perfil/api/noticias.php`. */
export const createObtenerNoticias = (deps: ObtenerNoticiasDeps): ObtenerNoticias => {
  const recolectar = async () => {
    // Se piden en paralelo, pero se procesan en el orden de las fuentes (la deduplicación depende de él).
    const crudos = await Promise.all(deps.fuentes.map((f) => deps.feeds.traer(f.url).catch(() => null)));
    const vistas = new Set<string>();
    const todas = deps.fuentes.flatMap((fuente, i) => {
      const crudo = crudos[i];
      return crudo ? seleccionarDeFuente(parsearFeed(fuente.tipo, crudo), fuente, deps.claves, vistas) : [];
    });
    return intercalarPorCategoria(todas);
  };

  return {
    async ejecutar() {
      const rapida = await sinFallar(() => deps.cacheRapida.leer());
      if (rapida) return rapida.respuesta;

      const ahora = deps.clock.now();
      const durable = await sinFallar(() => deps.cacheDurable.leer());
      if (durable && ahora.getTime() - durable.guardadoEn.getTime() < deps.frescuraMs) {
        await sinFallar(() => deps.cacheRapida.guardar(durable.respuesta, durable.guardadoEn));
        return durable.respuesta;
      }

      const noticias = await recolectar();
      if (noticias.length > 0) {
        const respuesta: NoticiasRespuesta = { ok: true, actualizado: isoSegundos(ahora), noticias };
        await Promise.all([
          sinFallar(() => deps.cacheDurable.guardar(respuesta, ahora)),
          sinFallar(() => deps.cacheRapida.guardar(respuesta, ahora)),
        ]);
        return respuesta;
      }
      // Todas las fuentes fallaron: la última copia buena, aunque sea vieja.
      return durable?.respuesta ?? { ok: false, actualizado: isoSegundos(ahora), noticias: [] };
    },
  };
};
