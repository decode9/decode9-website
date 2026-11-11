import type { NoticiasRespuesta } from "../domain/noticia.js";

export interface EntradaCacheNoticias {
  respuesta: NoticiasRespuesta;
  guardadoEn: Date;
}

/** Almacén de la última respuesta de /noticias. */
export interface NoticiasCache {
  leer(): Promise<EntradaCacheNoticias | null>;
  guardar(respuesta: NoticiasRespuesta, guardadoEn: Date): Promise<void>;
}
