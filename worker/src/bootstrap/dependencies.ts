import type { Context } from "hono";
import { createCacheApiNoticias } from "../adapters/cache/cache-api-noticias.adapter.js";
import { createFetchFeed } from "../adapters/feeds/fetch-feed.adapter.js";
import { createNotifier } from "../adapters/notifier/notifier.factory.js";
import { createCryptoRandom } from "../adapters/system/crypto-random.adapter.js";
import { createExecutionContextTasks } from "../adapters/system/execution-context-tasks.adapter.js";
import { createSystemClock } from "../adapters/system/system-clock.adapter.js";
import { createWebCryptoHasher } from "../adapters/system/web-crypto-hasher.adapter.js";
import { loadAppConfig } from "../config/app.config.js";
import { CLAVES_NOTICIAS, FUENTES_NOTICIAS, NOTICIAS_CACHE_MIN } from "../config/noticias.config.js";
import type { ApiControllers } from "../controllers/api-controllers.js";
import { createNoticiasController } from "../controllers/noticias.controller.js";
import { createSenalController } from "../controllers/senal.controller.js";
import { createWalkieController } from "../controllers/walkie.controller.js";
import { createD1LimiteRepository } from "../database/repositories/d1-limite.repository.js";
import { createD1MensajeRepository } from "../database/repositories/d1-mensaje.repository.js";
import { createD1NoticiasCache } from "../database/repositories/d1-noticias-cache.repository.js";
import { createD1SenalRepository } from "../database/repositories/d1-senal.repository.js";
import type { AppEnv } from "../interfaces/http/app-env.interface.js";
import { createLimiteEnvios } from "../services/limite/limite-envios.service.js";
import { createObtenerNoticias } from "../services/noticias/obtener-noticias.service.js";
import { createRegistrarSenal } from "../services/senal/registrar-senal.service.js";
import { createRegistrarMensaje } from "../services/walkie/registrar-mensaje.service.js";

/** `c.executionCtx` lanza fuera del runtime de Workers (p. ej. en pruebas con `app.request`). */
const contextoDe = (c: Context<AppEnv>) => {
  try {
    return c.executionCtx;
  } catch {
    return undefined;
  }
};

const cacheDeBorde = (): Cache | undefined => (typeof caches === "undefined" ? undefined : caches.default);

/** DI a mano por petición: los bindings (D1) y `waitUntil` solo existen dentro de `fetch`. */
export function getApiControllers(c: Context<AppEnv>): ApiControllers {
  const env = c.env;
  const config = loadAppConfig(env);
  const clock = createSystemClock();
  const notifier = createNotifier(config.notificaciones);
  const tareas = createExecutionContextTasks(contextoDe(c));
  const limite = createLimiteEnvios({
    repo: createD1LimiteRepository(env.DB),
    hasher: createWebCryptoHasher(),
    clock,
    salt: config.salt,
    ...config.limite,
  });

  return {
    senal: createSenalController(
      createRegistrarSenal({
        senales: createD1SenalRepository(env.DB),
        limite,
        random: createCryptoRandom(),
        clock,
        notifier,
        tareas,
      }),
    ),
    walkie: createWalkieController(
      createRegistrarMensaje({ mensajes: createD1MensajeRepository(env.DB), limite, clock, notifier, tareas }),
    ),
    noticias: createNoticiasController(
      createObtenerNoticias({
        fuentes: FUENTES_NOTICIAS,
        claves: CLAVES_NOTICIAS,
        feeds: createFetchFeed(),
        cacheRapida: createCacheApiNoticias(cacheDeBorde(), NOTICIAS_CACHE_MIN * 60),
        cacheDurable: createD1NoticiasCache(env.DB),
        clock,
        frescuraMs: NOTICIAS_CACHE_MIN * 60 * 1000,
      }),
    ),
  };
}

export const getAllowedOrigins = (env: AppEnv["Bindings"]): string[] => loadAppConfig(env).allowedOrigins;
