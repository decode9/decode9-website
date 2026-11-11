export type TipoFuente = "rss" | "atom" | "hn";

export interface FuenteNoticias {
  cat: string;
  tipo: TipoFuente;
  nombre: string;
  url: string;
  /** Máximo de titulares que aporta la fuente. */
  max: number;
}

/** Entrada leída de un feed (título ya limpio, fecha en ms o null si no se pudo leer). */
export interface ItemFeed {
  titulo: string;
  url: string;
  fecha: number | null;
}

export interface Noticia {
  cat: string;
  fuente: string;
  titulo: string;
  url: string;
  /** ISO 8601 (`2026-11-11T10:00:00+00:00`) o null. */
  fecha: string | null;
}

export interface NoticiasRespuesta {
  ok: boolean;
  actualizado: string;
  noticias: Noticia[];
}
