/** Valor de entrada a texto, como el `(string)` de PHP para escalares. */
export const aTexto = (valor: unknown): string => {
  if (typeof valor === "string") return valor;
  if (typeof valor === "number" || typeof valor === "bigint") return String(valor);
  if (typeof valor === "boolean") return valor ? "1" : "";
  return "";
};

/** Quita etiquetas HTML (también una etiqueta sin cerrar al final, como `strip_tags`). */
export const quitarEtiquetas = (texto: string): string =>
  texto.replace(/<!--[\s\S]*?(-->|$)/g, "").replace(/<[^>]*(>|$)/g, "");

/** Corta por caracteres Unicode (como `mb_substr`), no por unidades UTF-16. */
export const cortar = (texto: string, max: number): string => Array.from(texto).slice(0, max).join("");

export const largo = (texto: string): number => Array.from(texto).length;

/** Igual que `limpio()` de los PHP de formularios: trim + sin etiquetas + sin controles + máximo. */
export const limpiarTexto = (valor: unknown, max: number): string => {
  // eslint-disable-next-line no-control-regex
  const sinControles = quitarEtiquetas(aTexto(valor)).trim().replace(/[\x00-\x1F\x7F]/g, " ");
  return cortar(sinControles, max);
};

/** `empty()` de PHP: "", "0", 0, false, null, undefined y [] cuentan como vacío. */
export const vacioPhp = (valor: unknown): boolean =>
  valor === undefined ||
  valor === null ||
  valor === false ||
  valor === 0 ||
  valor === "" ||
  valor === "0" ||
  (Array.isArray(valor) && valor.length === 0);
