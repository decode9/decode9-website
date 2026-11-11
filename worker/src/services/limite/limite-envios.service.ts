import type { Clock } from "../../interfaces/ports/clock.interface.js";
import type { Hasher } from "../../interfaces/ports/hasher.interface.js";
import type { LimiteRepository } from "../../interfaces/repositories/limite-repository.interface.js";
import { LimiteExcedidoError } from "../../utils/shared/app-error.util.js";
import { almacenar } from "../shared/almacenar.js";

export type AmbitoLimite = "senal" | "walkie";

export interface LimiteEnviosDeps {
  repo: LimiteRepository;
  hasher: Hasher;
  clock: Clock;
  /** Sal secreta: la IP nunca se guarda, solo su hash con sal. */
  salt: string;
  max: number;
  ventanaSeg: number;
}

export interface LimiteEnvios {
  /** Huella anónima (16 hex) de la IP, la misma que se guarda con cada envío. */
  huella(ip: string): Promise<string>;
  /** Cuenta un envío; lanza `espera` (429) si ya hubo `max` en la ventana. Cada ámbito cuenta aparte. */
  consumir(ambito: AmbitoLimite, ip: string): Promise<string>;
}

export const createLimiteEnvios = (deps: LimiteEnviosDeps): LimiteEnvios => {
  const huella = async (ip: string) => (await deps.hasher.sha256Hex(`${ip}|${deps.salt}`)).slice(0, 16);

  return {
    huella,
    async consumir(ambito, ip) {
      const h = await huella(ip);
      const ahora = Math.floor(deps.clock.now().getTime() / 1000);
      const desde = ahora - deps.ventanaSeg;
      await almacenar(async () => {
        await deps.repo.purgarAntesDe(desde);
        if ((await deps.repo.contarDesde(ambito, h, desde)) >= deps.max) throw new LimiteExcedidoError();
        await deps.repo.registrar(ambito, h, ahora);
      });
      return h;
    },
  };
};
