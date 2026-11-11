import type { Context } from "hono";
import type { RegistrarSenal } from "../services/senal/registrar-senal.service.js";
import { ipDe, leerCuerpo } from "./shared/solicitud.js";

export const createSenalController = (registrarSenal: RegistrarSenal) => ({
  registrar: async (c: Context) => c.json(await registrarSenal.ejecutar(await leerCuerpo(c), ipDe(c))),
});
