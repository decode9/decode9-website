import type { Context } from "hono";
import type { ObtenerNoticias } from "../services/noticias/obtener-noticias.service.js";

export const createNoticiasController = (obtenerNoticias: ObtenerNoticias) => ({
  listar: async (c: Context) => {
    c.header("Cache-Control", "public, max-age=600");
    return c.json(await obtenerNoticias.ejecutar());
  },
});
