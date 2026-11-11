/**
 * Errores de aplicación. El `code` es el `error` que recibe el frontend
 * (`{ ok: false, error: code }`); el único lugar que los traduce a HTTP es
 * `middleware/error/error-handler.middleware.ts`.
 */
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
  ) {
    super(code);
    this.name = "AppError";
  }
}

/** 422 · datos inválidos. `code`: alias | correo | whatsapp | regreso | vacio. */
export class SolicitudInvalidaError extends AppError {
  constructor(code: string) {
    super(422, code);
  }
}

/** 429 · más de 5 envíos en 10 minutos. */
export class LimiteExcedidoError extends AppError {
  constructor() {
    super(429, "espera");
  }
}

/** 500 · no se pudo guardar. */
export class AlmacenamientoError extends AppError {
  constructor() {
    super(500, "almacenamiento");
  }
}
