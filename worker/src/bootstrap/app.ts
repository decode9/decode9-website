import { Hono } from "hono";
import type { Context } from "hono";
import type { ApiControllers } from "../controllers/api-controllers.js";
import type { AppEnv, Bindings } from "../interfaces/http/app-env.interface.js";
import { errorHandler, notFoundHandler } from "../middleware/error/error-handler.middleware.js";
import { corsPermitidos } from "../middleware/security/cors.middleware.js";
import { limiteCuerpo } from "../middleware/security/limite-cuerpo.middleware.js";
import { securityHeaders } from "../middleware/security/security-headers.middleware.js";
import { apiRoutes } from "../routes/api.routes.js";
import { getAllowedOrigins, getApiControllers } from "./dependencies.js";

/** Piezas reemplazables (las pruebas inyectan fakes). */
export interface AppDependencies {
  controllers: (c: Context<AppEnv>) => ApiControllers;
  allowedOrigins: (env: Bindings) => string[];
}

const defaults: AppDependencies = { controllers: getApiControllers, allowedOrigins: getAllowedOrigins };

export function createApp(overrides: Partial<AppDependencies> = {}): Hono<AppEnv> {
  const deps = { ...defaults, ...overrides };
  const app = new Hono<AppEnv>();

  app.use("*", securityHeaders());
  app.use("*", corsPermitidos(deps.allowedOrigins));
  app.use("*", limiteCuerpo());

  app.get("/", (c) => c.json({ ok: true, nombre: "decode9-api" }));
  app.route("/", apiRoutes(deps.controllers));

  app.notFound(notFoundHandler);
  app.onError(errorHandler);
  return app;
}
