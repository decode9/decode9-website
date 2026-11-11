import type { Notifier } from "../../interfaces/ports/notifier.port.js";
import { createNoopNotifier } from "./noop.notifier.js";
import { createResendNotifier } from "./resend.notifier.js";

/** Resend si hay credenciales; si no, no-op. */
export const createNotifier = (cfg: { apiKey: string; de: string; para: string[] } | null): Notifier =>
  cfg ? createResendNotifier(cfg) : createNoopNotifier();
