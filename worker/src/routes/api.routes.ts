import { Hono } from "hono";
import type { Context } from "hono";
import type { ApiControllers } from "../controllers/api-controllers.js";
import type { AppEnv } from "../interfaces/http/app-env.interface.js";
import { metodoNoPermitido } from "../middleware/error/error-handler.middleware.js";

/** Contrato público de decode9-api. Los controladores se arman por petición. */
export const apiRoutes = (controllers: (c: Context<AppEnv>) => ApiControllers) => {
  const r = new Hono<AppEnv>();
  r.post("/senal", (c) => controllers(c).senal.registrar(c));
  r.all("/senal", metodoNoPermitido);
  r.post("/walkie", (c) => controllers(c).walkie.registrar(c));
  r.all("/walkie", metodoNoPermitido);
  r.get("/noticias", (c) => controllers(c).noticias.listar(c));
  r.all("/noticias", metodoNoPermitido);
  return r;
};
