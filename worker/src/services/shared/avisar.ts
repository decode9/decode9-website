import type { Aviso } from "../../interfaces/domain/aviso.js";
import type { BackgroundTasks } from "../../interfaces/ports/background-tasks.port.js";
import type { Notifier } from "../../interfaces/ports/notifier.port.js";

/** El correo nunca bloquea ni rompe la respuesta: va en segundo plano y sus fallos solo se registran. */
export const avisarEnSegundoPlano = (notifier: Notifier, tareas: BackgroundTasks, aviso: Aviso): void => {
  tareas.programar(
    notifier.notificar(aviso).catch((err: unknown) => {
      console.error("No se pudo enviar el aviso:", err instanceof Error ? err.message : err);
    }),
  );
};
