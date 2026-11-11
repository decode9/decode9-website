import type { Context } from "hono";
import type { RegistrarMensaje } from "../services/walkie/registrar-mensaje.service.js";
import { ipDe, leerCuerpo } from "./shared/solicitud.js";

export const createWalkieController = (registrarMensaje: RegistrarMensaje) => ({
  registrar: async (c: Context) => c.json(await registrarMensaje.ejecutar(await leerCuerpo(c), ipDe(c))),
});
