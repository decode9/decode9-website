import type { Aviso } from "../../src/interfaces/domain/aviso.js";
import type { Mensaje } from "../../src/interfaces/domain/mensaje.js";
import type { NoticiasRespuesta } from "../../src/interfaces/domain/noticia.js";
import type { Senal } from "../../src/interfaces/domain/senal.js";
import type { BackgroundTasks } from "../../src/interfaces/ports/background-tasks.port.js";
import type { Clock } from "../../src/interfaces/ports/clock.interface.js";
import type { FeedFetcher } from "../../src/interfaces/ports/feed-fetcher.port.js";
import type { Hasher } from "../../src/interfaces/ports/hasher.interface.js";
import type { EntradaCacheNoticias, NoticiasCache } from "../../src/interfaces/ports/noticias-cache.port.js";
import type { Notifier } from "../../src/interfaces/ports/notifier.port.js";
import type { Random } from "../../src/interfaces/ports/random.interface.js";
import type { LimiteRepository } from "../../src/interfaces/repositories/limite-repository.interface.js";
import type { MensajeRepository } from "../../src/interfaces/repositories/mensaje-repository.interface.js";
import type { SenalRepository } from "../../src/interfaces/repositories/senal-repository.interface.js";

export class FixedClock implements Clock {
  constructor(public actual = new Date("2026-11-11T12:00:00Z")) {}
  now = () => new Date(this.actual);
  avanzar(segundos: number) {
    this.actual = new Date(this.actual.getTime() + segundos * 1000);
  }
}

export const fixedRandom = (valor = 4242): Random => ({ entero: () => valor });

/** Hash determinista y legible (no criptográfico): basta para distinguir entradas. */
export const fakeHasher: Hasher = {
  async sha256Hex(texto) {
    let h = 0;
    for (const ch of texto) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h.toString(16).padStart(8, "0").repeat(8);
  },
};

export class MemoryLimiteRepository implements LimiteRepository {
  marcas: { ambito: string; huella: string; en: number }[] = [];
  async contarDesde(ambito: string, huella: string, desde: number) {
    return this.marcas.filter((m) => m.ambito === ambito && m.huella === huella && m.en > desde).length;
  }
  async registrar(ambito: string, huella: string, en: number) {
    this.marcas.push({ ambito, huella, en });
  }
  async purgarAntesDe(antes: number) {
    this.marcas = this.marcas.filter((m) => m.en > antes);
  }
}

export class MemorySenalRepository implements SenalRepository {
  guardadas: Senal[] = [];
  falla = false;
  async guardar(s: Senal) {
    if (this.falla) throw new Error("D1 caído");
    this.guardadas.push(s);
  }
}

export class MemoryMensajeRepository implements MensajeRepository {
  guardados: Mensaje[] = [];
  async guardar(m: Mensaje) {
    this.guardados.push(m);
  }
}

export class RecordingNotifier implements Notifier {
  avisos: Aviso[] = [];
  falla = false;
  async notificar(aviso: Aviso) {
    if (this.falla) throw new Error("Resend caído");
    this.avisos.push(aviso);
  }
}

export class CollectingTasks implements BackgroundTasks {
  tareas: Promise<unknown>[] = [];
  programar(tarea: Promise<unknown>) {
    this.tareas.push(tarea);
  }
  terminar = () => Promise.all(this.tareas);
}

export class MapFeedFetcher implements FeedFetcher {
  llamadas: string[] = [];
  constructor(private readonly cuerpos: Record<string, string | null>) {}
  async traer(url: string) {
    this.llamadas.push(url);
    return this.cuerpos[url] ?? null;
  }
}

export class MemoryNoticiasCache implements NoticiasCache {
  constructor(public entrada: EntradaCacheNoticias | null = null) {}
  async leer() {
    return this.entrada;
  }
  async guardar(respuesta: NoticiasRespuesta, guardadoEn: Date) {
    this.entrada = { respuesta, guardadoEn };
  }
}
