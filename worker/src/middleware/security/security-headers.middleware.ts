import type { MiddlewareHandler } from "hono";

/** Mismas cabeceras que los PHP: `nosniff` y, salvo que la ruta diga otra cosa, `no-store`. */
export const securityHeaders = (): MiddlewareHandler => async (c, next) => {
  await next();
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  if (!c.res.headers.has("Cache-Control")) c.res.headers.set("Cache-Control", "no-store");
};
