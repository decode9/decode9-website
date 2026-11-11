import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";
import type { AppEnv, Bindings } from "../../interfaces/http/app-env.interface.js";

/** CORS solo para los orígenes de `ALLOWED_ORIGINS`. Cualquier otro no recibe cabeceras. */
export const corsPermitidos = (origenes: (env: Bindings) => string[]): MiddlewareHandler<AppEnv> =>
  cors({
    origin: (origin, c) => (origenes((c.env ?? {}) as Bindings).includes(origin) ? origin : null),
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 600,
  });
