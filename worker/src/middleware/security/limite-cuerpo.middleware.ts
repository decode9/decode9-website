import { bodyLimit } from "hono/body-limit";

/** Los formularios son pequeños (máx. ~1,5 KB útiles): se corta en 16 KB. */
export const limiteCuerpo = () =>
  bodyLimit({ maxSize: 16 * 1024, onError: (c) => c.json({ ok: false, error: "tamano" }, 413) });
