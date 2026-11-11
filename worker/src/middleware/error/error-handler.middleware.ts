import type { Context } from "hono";
import { AppError } from "../../utils/shared/app-error.util.js";

/** El único lugar que traduce un error a HTTP. Formato de siempre: `{ ok: false, error }`. */
export function errorHandler(err: Error, c: Context): Response {
  if (err instanceof AppError) return c.json({ ok: false, error: err.code }, err.statusCode as 422);
  console.error("Error no controlado:", err.message);
  return c.json({ ok: false, error: "interno" }, 500);
}

export const notFoundHandler = (c: Context): Response => c.json({ ok: false, error: "ruta" }, 404);

export const metodoNoPermitido = (c: Context): Response => c.json({ ok: false, error: "metodo" }, 405);
