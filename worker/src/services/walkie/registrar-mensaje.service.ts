import type { Aviso } from "../../interfaces/domain/aviso.js";
import type { Mensaje, MensajeRespuesta } from "../../interfaces/domain/mensaje.js";
import type { BackgroundTasks } from "../../interfaces/ports/background-tasks.port.js";
import type { Clock } from "../../interfaces/ports/clock.interface.js";
import type { Notifier } from "../../interfaces/ports/notifier.port.js";
import type { MensajeRepository } from "../../interfaces/repositories/mensaje-repository.interface.js";
import { walkieSchema } from "../../dtos/walkie.dto.js";
import { isoSegundos } from "../../utils/shared/fecha.util.js";
import { vacioPhp } from "../../utils/texto/limpiar-texto.util.js";
import type { LimiteEnvios } from "../limite/limite-envios.service.js";
import { almacenar } from "../shared/almacenar.js";
import { avisarEnSegundoPlano } from "../shared/avisar.js";
import { validar } from "../shared/validar.js";
import { extraerContacto } from "./extraer-contacto.js";

export interface RegistrarMensajeDeps {
  mensajes: MensajeRepository;
  limite: LimiteEnvios;
  clock: Clock;
  notifier: Notifier;
  tareas: BackgroundTasks;
}

export interface RegistrarMensaje {
  ejecutar(entrada: Record<string, unknown>, ip: string): Promise<MensajeRespuesta>;
}

const avisoDe = (m: Mensaje): Aviso => ({
  asunto: "Walkie de Jorge · nuevo mensaje",
  texto:
    `Nuevo mensaje desde el walkie del perfil\n\n${m.texto}\n\n` +
    `Correo detectado: ${m.correo || "—"}\nNúmero detectado: ${m.numero || "—"}\n`,
  ...(m.correo ? { responderA: m.correo } : {}),
});

/** POST /walkie · port de `perfil/api/mensaje.php`. */
export const createRegistrarMensaje = (deps: RegistrarMensajeDeps): RegistrarMensaje => ({
  async ejecutar(entrada, ip) {
    if (!vacioPhp(entrada.web)) return { ok: true };

    const d = validar(walkieSchema, entrada);
    const huella = await deps.limite.consumir("walkie", ip);
    const mensaje: Mensaje = {
      fecha: isoSegundos(deps.clock.now()),
      idioma: d.lang,
      texto: d.texto,
      ...extraerContacto(d.texto),
      huella,
    };
    await almacenar(() => deps.mensajes.guardar(mensaje));
    avisarEnSegundoPlano(deps.notifier, deps.tareas, avisoDe(mensaje));
    return { ok: true };
  },
});
