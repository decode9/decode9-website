/** Trabajo que sigue después de responder (en el Worker: `ctx.waitUntil`). */
export interface BackgroundTasks {
  programar(tarea: Promise<unknown>): void;
}
