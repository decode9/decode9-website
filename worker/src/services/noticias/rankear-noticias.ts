import type { FuenteNoticias, ItemFeed, Noticia } from "../../interfaces/domain/noticia.js";
import { isoSegundos } from "../../utils/shared/fecha.util.js";

const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/** Cuántas palabras clave aparecen como palabra completa en el título (sin distinguir mayúsculas). */
export const puntaje = (titulo: string, claves: readonly string[]): number => {
  const t = titulo.toLowerCase();
  return claves.filter((k) =>
    new RegExp(`(?<![\\p{L}\\p{N}])${escapar(k.trim())}(?![\\p{L}\\p{N}])`, "u").test(t),
  ).length;
};

const ES_HTTP = /^https?:\/\//;

/**
 * Titulares de una fuente: primero lo cercano a las palabras clave, luego lo más reciente;
 * fuera los vacíos, los enlaces no http(s) y los ya vistos en otra fuente. Marca en `vistas` lo elegido.
 */
export const seleccionarDeFuente = (
  items: readonly ItemFeed[],
  fuente: FuenteNoticias,
  claves: readonly string[],
  vistas: Set<string>,
): Noticia[] => {
  const elegidas: Noticia[] = [];
  const ordenados = items
    .map((it) => ({ it, p: puntaje(it.titulo, claves) }))
    .sort((a, b) => b.p - a.p || (b.it.fecha ?? 0) - (a.it.fecha ?? 0));
  for (const { it } of ordenados) {
    if (elegidas.length >= fuente.max) break;
    if (!it.titulo || !ES_HTTP.test(it.url) || vistas.has(it.url)) continue;
    vistas.add(it.url);
    elegidas.push({
      cat: fuente.cat,
      fuente: fuente.nombre,
      titulo: it.titulo,
      url: it.url,
      fecha: it.fecha === null ? null : isoSegundos(new Date(it.fecha)),
    });
  }
  return elegidas;
};

/** Intercala por categoría (round-robin en orden de aparición) para que la cinta no repita fuente seguida. */
export const intercalarPorCategoria = (noticias: readonly Noticia[]): Noticia[] => {
  const porCat = new Map<string, Noticia[]>();
  for (const n of noticias) porCat.set(n.cat, [...(porCat.get(n.cat) ?? []), n]);
  const colas = [...porCat.values()];
  const mezcla: Noticia[] = [];
  for (let ronda = 0; mezcla.length < noticias.length; ronda++) {
    for (const cola of colas) {
      const n = cola[ronda];
      if (n) mezcla.push(n);
    }
  }
  return mezcla;
};
