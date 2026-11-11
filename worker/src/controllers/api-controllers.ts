import type { Context } from "hono";

type Manejador = (c: Context) => Promise<Response>;

export interface ApiControllers {
  senal: { registrar: Manejador };
  walkie: { registrar: Manejador };
  noticias: { listar: Manejador };
}
