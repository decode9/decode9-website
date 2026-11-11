import type { Aviso } from "../../interfaces/domain/aviso.js";
import type { Senal, SenalRespuesta } from "../../interfaces/domain/senal.js";
import type { BackgroundTasks } from "../../interfaces/ports/background-tasks.port.js";
import type { Clock } from "../../interfaces/ports/clock.interface.js";
import type { Notifier } from "../../interfaces/ports/notifier.port.js";
import type { Random } from "../../interfaces/ports/random.interface.js";
import type { SenalRepository } from "../../interfaces/repositories/senal-repository.interface.js";
import { senalSchema } from "../../dtos/senal.dto.js";
import { isoSegundos } from "../../utils/shared/fecha.util.js";
import { vacioPhp } from "../../utils/texto/limpiar-texto.util.js";
import type { LimiteEnvios } from "../limite/limite-envios.service.js";
import { almacenar } from "../shared/almacenar.js";
import { avisarEnSegundoPlano } from "../shared/avisar.js";
import { validar } from "../shared/validar.js";

export interface RegistrarSenalDeps {
  senales: SenalRepository;
  limite: LimiteEnvios;
  random: Random;
  clock: Clock;
  notifier: Notifier;
  tareas: BackgroundTasks;
}

export interface RegistrarSenal {
  ejecutar(entrada: Record<string, unknown>, ip: string): Promise<SenalRespuesta>;
}

const guion = (v: string) => v || "—";

const avisoDe = (s: Senal): Aviso => ({
  asunto: `decode9 · nueva señal ${s.codigo} de ${s.alias}`,
  texto:
    `Nueva señal en el transmisor (${s.origen})\n\nCódigo: ${s.codigo}\nAlias: ${s.alias}\n` +
    `Correo: ${guion(s.correo)}\nWhatsApp: ${guion(s.whatsapp)}\n` +
    `Temas: ${s.temas.length ? s.temas.join(", ") : "—"}\nMensaje:\n${guion(s.mensaje)}\n`,
  ...(s.correo ? { responderA: s.correo } : {}),
});

/** POST /senal · port de `decode9/api/senal.php`. */
export const createRegistrarSenal = (deps: RegistrarSenalDeps): RegistrarSenal => {
  const nuevoCodigo = () => `SOS-${deps.random.entero(1000, 9999)}`;

  return {
    async ejecutar(entrada, ip) {
      // Trampa para robots: el campo invisible viene lleno → éxito fingido, no se guarda nada.
      if (!vacioPhp(entrada.web)) return { ok: true, code: nuevoCodigo() };

      const d = validar(senalSchema, entrada);
      const huella = await deps.limite.consumir("senal", ip);
      const senal: Senal = {
        codigo: nuevoCodigo(),
        fecha: isoSegundos(deps.clock.now()),
        origen: d.origen,
        idioma: d.lang,
        alias: d.alias,
        correo: d.email,
        whatsapp: d.whatsapp,
        temas: d.topics,
        mensaje: d.msg,
        huella,
      };
      await almacenar(() => deps.senales.guardar(senal));
      avisarEnSegundoPlano(deps.notifier, deps.tareas, avisoDe(senal));
      return { ok: true, code: senal.codigo };
    },
  };
};
