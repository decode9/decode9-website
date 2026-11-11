const CORREO = /[^\s@]+@[^\s@]+\.[^\s@]+/u;
const NUMERO = /\+?\d[\d\s-]{6,}\d/;

export interface ContactoDetectado {
  correo: string;
  numero: string;
}

/** Detecta un correo o un teléfono escrito en el mensaje (mismas expresiones que `mensaje.php`). */
export const extraerContacto = (texto: string): ContactoDetectado => ({
  correo: CORREO.exec(texto)?.[0] ?? "",
  numero: NUMERO.exec(texto)?.[0].replace(/[\s-]/g, "") ?? "",
});
