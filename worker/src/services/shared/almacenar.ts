import { AlmacenamientoError, AppError } from "../../utils/shared/app-error.util.js";

/** Ejecuta una operación de persistencia; cualquier fallo de infraestructura es `almacenamiento` (500). */
export const almacenar = async <T>(operacion: () => Promise<T>): Promise<T> => {
  try {
    return await operacion();
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("Fallo de almacenamiento:", err instanceof Error ? err.message : err);
    throw new AlmacenamientoError();
  }
};
