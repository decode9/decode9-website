import { z } from "zod";
import { largo, limpiarTexto } from "../utils/texto/limpiar-texto.util.js";

/** Mensaje del walkie. Mismas reglas que `mensaje.php`. */
export const walkieSchema = z.object({
  texto: z
    .unknown()
    .default("")
    .transform((v) => limpiarTexto(v, 600))
    .refine((v) => largo(v) >= 3, { message: "vacio" }),
  lang: z.unknown().default("es").transform((v) => limpiarTexto(v ?? "es", 5)),
});

export type WalkieEntrada = z.output<typeof walkieSchema>;
