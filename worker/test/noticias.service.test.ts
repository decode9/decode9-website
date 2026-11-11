import { describe, expect, it } from "vitest";
import type { FuenteNoticias, Noticia } from "../src/interfaces/domain/noticia.js";
import { createObtenerNoticias } from "../src/services/noticias/obtener-noticias.service.js";
import { intercalarPorCategoria, puntaje } from "../src/services/noticias/rankear-noticias.js";
import { limpiarTitular, parsearFeed } from "../src/utils/feeds/parse-feed.util.js";
import { ATOM_PHP, HN_JSON, RSS_COINDESK, RSS_LARGO } from "./fakes/feeds.fixtures.js";
import { FixedClock, MapFeedFetcher, MemoryNoticiasCache } from "./fakes/ports.fake.js";

const FUENTES: FuenteNoticias[] = [
  { cat: "PHP", tipo: "atom", nombre: "php.net", url: "u:php", max: 2 },
  { cat: "Cripto", tipo: "rss", nombre: "CoinDesk", url: "u:coin", max: 5 },
  { cat: "Dev", tipo: "hn", nombre: "Hacker News", url: "u:hn", max: 6 },
  { cat: "Tecnología", tipo: "rss", nombre: "Ars Technica", url: "u:ars", max: 4 },
];
const CLAVES = ["php", "bitcoin", "rust", "database", "ai", "open source"];
const CUERPOS = { "u:php": ATOM_PHP, "u:coin": RSS_COINDESK, "u:hn": HN_JSON, "u:ars": RSS_LARGO };

const armar = (cuerpos: Record<string, string | null>, opciones: { rapida?: MemoryNoticiasCache; durable?: MemoryNoticiasCache } = {}) => {
  const feeds = new MapFeedFetcher(cuerpos);
  const rapida = opciones.rapida ?? new MemoryNoticiasCache();
  const durable = opciones.durable ?? new MemoryNoticiasCache();
  const clock = new FixedClock();
  const servicio = createObtenerNoticias({
    fuentes: FUENTES, claves: CLAVES, feeds, cacheRapida: rapida, cacheDurable: durable, clock, frescuraMs: 30 * 60 * 1000,
  });
  return { servicio, feeds, rapida, durable, clock };
};

describe("parsearFeed", () => {
  it("Atom: toma el link alternate o sin rel, y updated o published", () => {
    const items = parsearFeed("atom", ATOM_PHP);
    expect(items[0]).toEqual({ titulo: "PHP 8.5.1 Released!", url: "https://www.php.net/releases/8_5_1.php", fecha: Date.parse("2026-11-01T10:00:00Z") });
    expect(items[1]).toMatchObject({ titulo: "Conference & meetup", url: "https://www.php.net/conf", fecha: Date.parse("2026-11-05T10:00:00Z") });
  });

  it("RSS: CDATA sin etiquetas y entidades decodificadas", () => {
    expect(parsearFeed("rss", RSS_COINDESK)[0]).toMatchObject({ titulo: "Markets rally & stall", url: "https://coindesk.com/a" });
  });

  it("HN: enlace al hilo si no hay url y descarta títulos vacíos", () => {
    const items = parsearFeed("hn", HN_JSON);
    expect(items).toHaveLength(3);
    expect(items[1]?.url).toBe("https://news.ycombinator.com/item?id=42");
  });

  it("títulos de más de 140 se cortan con …; fecha ilegible es null; basura no lanza", () => {
    const [item] = parsearFeed("rss", RSS_LARGO);
    expect(item?.titulo).toHaveLength(140);
    expect(item?.titulo.endsWith("…")).toBe(true);
    expect(item?.fecha).toBeNull();
    expect(parsearFeed("hn", "{no json")).toEqual([]);
    expect(parsearFeed("rss", "<html>nada</html>")).toEqual([]);
  });

  it("limpiarTitular colapsa espacios", () => {
    expect(limpiarTitular("  a \n\t b  ")).toBe("a b");
  });
});

describe("puntaje", () => {
  it("cuenta palabras completas, sin distinguir mayúsculas", () => {
    expect(puntaje("PHP and Rust", CLAVES)).toBe(2);
    expect(puntaje("Said the paid", CLAVES)).toBe(0); // "ai" dentro de palabra no cuenta
    expect(puntaje("Open source AI", CLAVES)).toBe(2);
  });
});

describe("intercalarPorCategoria", () => {
  it("alterna categorías en orden de aparición", () => {
    const n = (cat: string, titulo: string): Noticia => ({ cat, fuente: cat, titulo, url: `https://x/${titulo}`, fecha: null });
    const r = intercalarPorCategoria([n("A", "a1"), n("A", "a2"), n("A", "a3"), n("B", "b1"), n("C", "c1"), n("C", "c2")]);
    expect(r.map((x) => x.titulo)).toEqual(["a1", "b1", "c1", "a2", "c2", "a3"]);
  });
});

describe("ObtenerNoticias (GET /noticias)", () => {
  it("rankea por clave y fecha, respeta el máximo, deduplica e intercala", async () => {
    const { servicio } = armar(CUERPOS);
    const r = await servicio.ejecutar();
    expect(r.ok).toBe(true);
    expect(r.actualizado).toBe("2026-11-11T12:00:00+00:00");
    const php = r.noticias.filter((x) => x.cat === "PHP").map((x) => x.titulo);
    // "PHP 8.5.1" gana por clave; luego la más reciente; máx. 2; el ftp:// se descarta
    expect(php).toEqual(["PHP 8.5.1 Released!", "Conference & meetup"]);
    const cripto = r.noticias.filter((x) => x.cat === "Cripto").map((x) => x.titulo);
    expect(cripto).toEqual(["Bitcoin hits new high", "Shared story about AI", "Markets rally & stall"]);
    // la historia compartida ya salió en CoinDesk: Hacker News no la repite
    const hn = r.noticias.filter((x) => x.cat === "Dev");
    expect(hn.map((x) => x.url)).toEqual(["https://example.com/rust-db", "https://news.ycombinator.com/item?id=42"]);
    expect(r.noticias.slice(0, 4).map((x) => x.cat)).toEqual(["PHP", "Cripto", "Dev", "Tecnología"]);
    expect(r.noticias[0]).toEqual({
      cat: "PHP", fuente: "php.net", titulo: "PHP 8.5.1 Released!", url: "https://www.php.net/releases/8_5_1.php", fecha: "2026-11-01T10:00:00+00:00",
    });
  });

  it("guarda en ambas cachés y la segunda llamada no vuelve a las fuentes", async () => {
    const { servicio, feeds, rapida, durable } = armar(CUERPOS);
    const primera = await servicio.ejecutar();
    expect(rapida.entrada?.respuesta).toEqual(primera);
    expect(durable.entrada?.respuesta).toEqual(primera);
    feeds.llamadas = [];
    await expect(servicio.ejecutar()).resolves.toEqual(primera);
    expect(feeds.llamadas).toHaveLength(0);
  });

  it("usa la copia de D1 si tiene menos de 30 min (workers.dev sin Cache API)", async () => {
    const copia = { ok: true, actualizado: "x", noticias: [] };
    const durable = new MemoryNoticiasCache({ respuesta: copia, guardadoEn: new Date("2026-11-11T11:45:00Z") });
    const { servicio, feeds } = armar(CUERPOS, { durable });
    await expect(servicio.ejecutar()).resolves.toBe(copia);
    expect(feeds.llamadas).toHaveLength(0);
  });

  it("copia de D1 vieja: vuelve a leer las fuentes", async () => {
    const durable = new MemoryNoticiasCache({ respuesta: { ok: true, actualizado: "viejo", noticias: [] }, guardadoEn: new Date("2026-11-11T11:00:00Z") });
    const { servicio } = armar(CUERPOS, { durable });
    expect((await servicio.ejecutar()).actualizado).toBe("2026-11-11T12:00:00+00:00");
  });

  it("si todas las fuentes fallan devuelve la copia vieja", async () => {
    const vieja = { ok: true, actualizado: "2026-11-10T00:00:00+00:00", noticias: [] };
    const durable = new MemoryNoticiasCache({ respuesta: vieja, guardadoEn: new Date("2026-11-10T00:00:00Z") });
    const { servicio } = armar({}, { durable });
    await expect(servicio.ejecutar()).resolves.toBe(vieja);
  });

  it("sin fuentes ni copia: ok false y lista vacía", async () => {
    const { servicio, durable } = armar({});
    await expect(servicio.ejecutar()).resolves.toEqual({ ok: false, actualizado: "2026-11-11T12:00:00+00:00", noticias: [] });
    expect(durable.entrada).toBeNull();
  });

  it("un fallo de caché no rompe la respuesta", async () => {
    const rota = new MemoryNoticiasCache();
    rota.leer = () => Promise.reject(new Error("cache"));
    rota.guardar = () => Promise.reject(new Error("cache"));
    const { servicio } = armar(CUERPOS, { rapida: rota, durable: rota });
    expect((await servicio.ejecutar()).ok).toBe(true);
  });
});
