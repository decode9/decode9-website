import type { Notifier } from "../../interfaces/ports/notifier.port.js";

export interface ResendConfig {
  apiKey: string;
  de: string;
  para: string[];
  fetcher?: typeof fetch;
}

const RESEND_URL = "https://api.resend.com/emails";

/** Aviso por correo con la API HTTP de Resend. Lanza si Resend responde con error. */
export const createResendNotifier = (cfg: ResendConfig): Notifier => {
  const enviar = cfg.fetcher ?? fetch;
  return {
    async notificar(aviso) {
      const res = await enviar(RESEND_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: cfg.de,
          to: cfg.para,
          subject: aviso.asunto,
          text: aviso.texto,
          ...(aviso.responderA ? { reply_to: aviso.responderA } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Resend respondió ${res.status}`);
    },
  };
};
