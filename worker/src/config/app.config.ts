import type { Bindings } from "../interfaces/http/app-env.interface.js";

export interface AppConfig {
  allowedOrigins: string[];
  salt: string;
  limite: { max: number; ventanaSeg: number };
  notificaciones: { apiKey: string; para: string[]; de: string } | null;
}

const lista = (valor: string | undefined) =>
  (valor ?? "").split(",").map((v) => v.trim()).filter(Boolean);

const SAL_DE_RESPALDO = "decode9-sin-sal";
let avisoSal = false;

export function loadAppConfig(env: Bindings): AppConfig {
  if (!env.SALT && !avisoSal) {
    avisoSal = true;
    console.warn("SALT no está configurado: la huella de IP usa una sal fija. Ejecuta `wrangler secret put SALT`.");
  }
  const para = lista(env.NOTIFY_TO);
  return {
    allowedOrigins: lista(env.ALLOWED_ORIGINS),
    salt: env.SALT || SAL_DE_RESPALDO,
    // Máximo de envíos por persona cada 10 minutos (como D9_LIMITE / JB_LIMITE).
    limite: { max: 5, ventanaSeg: 600 },
    notificaciones:
      env.RESEND_API_KEY && para.length > 0
        ? { apiKey: env.RESEND_API_KEY, para, de: env.NOTIFY_FROM || "decode9 <transmisor@decode9.codes>" }
        : null,
  };
}
