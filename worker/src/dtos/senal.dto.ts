import { z } from "zod";
import { largo, limpiarTexto } from "../utils/texto/limpiar-texto.util.js";

/**
 * Señal del transmisor. Mismas reglas que `senal.php`: los textos se limpian y se
 * recortan (no se rechazan por largos); el `message` de cada regla es el código de error.
 */
// `.default()` hace opcional la clave (sin ella zod 4 exige que exista).
const texto = (max: number) => z.unknown().default("").transform((v) => limpiarTexto(v, max));
const email = z.email();
const WHATSAPP = /^\+?[\d\s-]{7,}$/;

export const MAX_TEMAS = 10;

export const senalSchema = z
  .object({
    alias: texto(40).refine((v) => largo(v) >= 2, { message: "alias" }),
    email: texto(120).refine((v) => v === "" || email.safeParse(v).success, { message: "correo" }),
    whatsapp: texto(40).refine((v) => v === "" || WHATSAPP.test(v), { message: "whatsapp" }),
    msg: texto(500),
    origen: z.unknown().default("").transform((v) => (v === "movil" ? "movil" : "escritorio")),
    lang: z.unknown().default("es").transform((v) => limpiarTexto(v ?? "es", 5)),
    topics: z
      .unknown()
      .default([])
      .transform((v) => (Array.isArray(v) ? v.slice(0, MAX_TEMAS).map((t) => limpiarTexto(t, 40)) : [])),
  })
  .refine((d) => d.email !== "" || d.whatsapp !== "", { message: "regreso" });

export type SenalEntrada = z.output<typeof senalSchema>;
