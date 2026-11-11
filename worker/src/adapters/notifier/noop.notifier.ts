import type { Notifier } from "../../interfaces/ports/notifier.port.js";

/** Sin secrets de Resend: no envía nada (lo enviado queda igual en D1). */
export const createNoopNotifier = (): Notifier => ({ notificar: async () => undefined });
