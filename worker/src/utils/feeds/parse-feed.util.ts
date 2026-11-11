import type { ItemFeed, TipoFuente } from "../../interfaces/domain/noticia.js";
import { cortar, largo, quitarEtiquetas } from "../texto/limpiar-texto.util.js";

/**
 * Lectura mínima de RSS 2.0, Atom y la API de Hacker News (Algolia), sin dependencias.
 * Replica lo que hacía `noticias.php` con SimpleXML: el XML decodifica entidades una vez
 * (salvo dentro de CDATA) y luego `limpio()` quita etiquetas y decodifica HTML otra vez.
 */

const ENTIDADES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", mdash: "—", ndash: "–", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  laquo: "«", raquo: "»", copy: "©", reg: "®", trade: "™", euro: "€", middot: "·",
};

const desdeCodigo = (codigo: number): string => {
  try {
    return String.fromCodePoint(codigo);
  } catch {
    return "";
  }
};

/** Decodifica entidades con nombre conocidas y numéricas (`&#39;`, `&#x2019;`). */
export const decodificarEntidades = (texto: string): string =>
  texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entera, cuerpo: string) => {
    if (cuerpo[0] === "#") {
      const hex = cuerpo[1] === "x" || cuerpo[1] === "X";
      return desdeCodigo(Number.parseInt(cuerpo.slice(hex ? 2 : 1), hex ? 16 : 10));
    }
    return ENTIDADES[cuerpo.toLowerCase()] ?? entera;
  });

/** Contenido de texto de un nodo XML: CDATA tal cual, el resto con entidades decodificadas. */
const textoXml = (crudo: string): string =>
  crudo
    .split(/(<!\[CDATA\[[\s\S]*?\]\]>)/)
    .map((parte) => (parte.startsWith("<![CDATA[") ? parte.slice(9, -3) : decodificarEntidades(parte)))
    .join("");

/** `limpio()` de noticias.php: sin etiquetas, entidades HTML decodificadas, espacios colapsados, máx. 140. */
export const limpiarTitular = (texto: string, max = 140): string => {
  const t = decodificarEntidades(quitarEtiquetas(texto)).trim().replace(/\s+/gu, " ");
  return largo(t) > max ? `${cortar(t, max - 1)}…` : t;
};

const bloques = (xml: string, etiqueta: string): string[] =>
  [...xml.matchAll(new RegExp(`<${etiqueta}\\b[^>]*>([\\s\\S]*?)</${etiqueta}>`, "gi"))].map((m) => m[1] ?? "");

const contenido = (xml: string, etiqueta: string): string => {
  const m = new RegExp(`<${etiqueta}\\b[^>]*>([\\s\\S]*?)</${etiqueta}>`, "i").exec(xml);
  return m ? textoXml(m[1] ?? "").trim() : "";
};

const atributo = (etiqueta: string, nombre: string): string | null => {
  const m = new RegExp(`\\s${nombre}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(etiqueta);
  return m ? decodificarEntidades(m[1] ?? m[2] ?? "") : null;
};

const fechaMs = (texto: string | undefined | null): number | null => {
  if (!texto) return null;
  const ms = Date.parse(texto.trim());
  return Number.isNaN(ms) ? null : ms;
};

/** Primer `<link>` con `rel` vacío o `alternate` (como el PHP). */
const enlaceAtom = (entrada: string): string => {
  for (const [etiqueta] of entrada.matchAll(/<link\b[^>]*>/gi)) {
    const rel = atributo(etiqueta, "rel") ?? "";
    if (rel === "" || rel === "alternate") return (atributo(etiqueta, "href") ?? "").trim();
  }
  return "";
};

const leerRss = (xml: string): ItemFeed[] =>
  bloques(xml, "item").map((item) => ({
    titulo: limpiarTitular(contenido(item, "title")),
    url: contenido(item, "link"),
    fecha: fechaMs(contenido(item, "pubDate")),
  }));

const leerAtom = (xml: string): ItemFeed[] =>
  bloques(xml, "entry").map((entrada) => ({
    titulo: limpiarTitular(contenido(entrada, "title")),
    url: enlaceAtom(entrada),
    fecha: fechaMs(contenido(entrada, "updated") || contenido(entrada, "published")),
  }));

interface HitHn {
  title?: unknown;
  url?: unknown;
  objectID?: unknown;
  created_at?: unknown;
}

const leerHn = (crudo: string): ItemFeed[] => {
  let datos: unknown;
  try {
    datos = JSON.parse(crudo);
  } catch {
    return [];
  }
  const hits = (datos as { hits?: unknown } | null)?.hits;
  if (!Array.isArray(hits)) return [];
  return (hits as HitHn[])
    .filter((h) => typeof h.title === "string" && h.title !== "")
    .map((h) => ({
      titulo: limpiarTitular(h.title as string),
      url:
        typeof h.url === "string" && h.url !== ""
          ? h.url
          : `https://news.ycombinator.com/item?id=${String(h.objectID as string | number)}`,
      fecha: fechaMs(typeof h.created_at === "string" ? h.created_at : null),
    }));
};

/** Items de una fuente según su tipo. Nunca lanza: un cuerpo ilegible da una lista vacía. */
export const parsearFeed = (tipo: TipoFuente, crudo: string): ItemFeed[] => {
  if (tipo === "hn") return leerHn(crudo);
  return tipo === "atom" ? leerAtom(crudo) : leerRss(crudo);
};
