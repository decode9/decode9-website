import type { z } from "zod";
import { SolicitudInvalidaError } from "../../utils/shared/app-error.util.js";

/** Valida con zod; el primer problema se vuelve el código de error (422). */
export const validar = <S extends z.ZodType>(esquema: S, entrada: unknown): z.output<S> => {
  const r = esquema.safeParse(entrada);
  if (!r.success) throw new SolicitudInvalidaError(r.error.issues[0]?.message ?? "solicitud");
  return r.data;
};
