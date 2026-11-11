import type { Context } from "hono";

const esObjeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** `topics[]=a&topics[]=b` → `topics: ["a", "b"]`. */
const normalizarFormulario = (form: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(form).map(([k, v]) => (k.endsWith("[]") ? [k.slice(0, -2), Array.isArray(v) ? v : [v]] : [k, v])),
  );

const desdeUrlEncoded = (texto: string): Record<string, unknown> => {
  const form: Record<string, string | string[]> = {};
  for (const [k, v] of new URLSearchParams(texto)) {
    const previo = form[k];
    form[k] = previo === undefined ? v : [...(Array.isArray(previo) ? previo : [previo]), v];
  }
  return normalizarFormulario(form);
};

/**
 * Cuerpo de un formulario, como en PHP: primero JSON (con cualquier Content-Type, también
 * `text/plain` para evitar el preflight de CORS) y si no, formulario clásico. Ilegible → `{}`.
 */
export const leerCuerpo = async (c: Context): Promise<Record<string, unknown>> => {
  const texto = await c.req.text();
  try {
    const datos: unknown = JSON.parse(texto);
    if (esObjeto(datos)) return datos;
  } catch {
    // no es JSON: se prueba como formulario
  }
  const tipo = c.req.header("content-type") ?? "";
  if (tipo.includes("application/x-www-form-urlencoded")) return desdeUrlEncoded(texto);
  if (tipo.includes("multipart/form-data")) return normalizarFormulario(await c.req.parseBody({ all: true }));
  return {};
};

/** IP del visitante según Cloudflare (solo se usa para la huella con sal; nunca se guarda). */
export const ipDe = (c: Context): string => c.req.header("cf-connecting-ip") ?? "";
