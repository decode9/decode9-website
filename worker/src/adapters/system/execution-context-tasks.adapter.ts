import type { BackgroundTasks } from "../../interfaces/ports/background-tasks.port.js";

interface ConWaitUntil {
  waitUntil(promesa: Promise<unknown>): void;
}

/** Tareas tras la respuesta con `ctx.waitUntil`; sin contexto (pruebas) la promesa sigue sola. */
export const createExecutionContextTasks = (ctx: ConWaitUntil | undefined): BackgroundTasks => ({
  programar(tarea) {
    if (ctx) ctx.waitUntil(tarea);
    else void tarea;
  },
});
