import { beforeEach, describe, expect, it } from "vitest";
import { createLimiteEnvios } from "../src/services/limite/limite-envios.service.js";
import { extraerContacto } from "../src/services/walkie/extraer-contacto.js";
import { createRegistrarMensaje } from "../src/services/walkie/registrar-mensaje.service.js";
import { AppError } from "../src/utils/shared/app-error.util.js";
import {
  CollectingTasks,
  FixedClock,
  MemoryLimiteRepository,
  MemoryMensajeRepository,
  RecordingNotifier,
  fakeHasher,
} from "./fakes/ports.fake.js";

const IP = "203.0.113.7";

describe("extraerContacto", () => {
  it.each([
    ["escríbeme a ana.perez@correo.com mañana", "ana.perez@correo.com", ""],
    ["llámame al +58 412-555-1234 porfa", "", "+584125551234"],
    ["mi correo: a@b.co y tel 0414 1234567", "a@b.co", "04141234567"],
    ["solo una idea de mundo", "", ""],
    ["123 corto", "", ""],
  ])("%s", (texto, correo, numero) => {
    expect(extraerContacto(texto)).toEqual({ correo, numero });
  });
});

describe("RegistrarMensaje (POST /walkie)", () => {
  let mensajes: MemoryMensajeRepository;
  let limites: MemoryLimiteRepository;
  let notifier: RecordingNotifier;
  let tareas: CollectingTasks;
  let servicio: ReturnType<typeof createRegistrarMensaje>;

  beforeEach(() => {
    mensajes = new MemoryMensajeRepository();
    limites = new MemoryLimiteRepository();
    notifier = new RecordingNotifier();
    tareas = new CollectingTasks();
    const clock = new FixedClock();
    const limite = createLimiteEnvios({ repo: limites, hasher: fakeHasher, clock, salt: "sal", max: 5, ventanaSeg: 600 });
    servicio = createRegistrarMensaje({ mensajes, limite, clock, notifier, tareas });
  });

  const codigoDe = async (entrada: Record<string, unknown>) => {
    try {
      await servicio.ejecutar(entrada, IP);
    } catch (e) {
      if (e instanceof AppError) return `${e.statusCode} ${e.code}`;
      throw e;
    }
    return "ok";
  };

  it("guarda el texto con el contacto detectado y avisa", async () => {
    await expect(servicio.ejecutar({ texto: "Un mundo de cristal. yo@x.dev", lang: "en" }, IP)).resolves.toEqual({ ok: true });
    expect(mensajes.guardados[0]).toMatchObject({ texto: "Un mundo de cristal. yo@x.dev", idioma: "en", correo: "yo@x.dev", numero: "" });
    await tareas.terminar();
    expect(notifier.avisos[0]?.asunto).toBe("Walkie de Jorge · nuevo mensaje");
    expect(notifier.avisos[0]?.responderA).toBe("yo@x.dev");
  });

  it("texto de menos de 3 caracteres (tras limpiar) → 422 vacio", async () => {
    expect(await codigoDe({ texto: " <i>a</i> " })).toBe("422 vacio");
    expect(await codigoDe({})).toBe("422 vacio");
  });

  it("recorta a 600 caracteres", async () => {
    await servicio.ejecutar({ texto: "z".repeat(700) }, IP);
    expect(mensajes.guardados[0]?.texto).toHaveLength(600);
    expect(mensajes.guardados[0]?.idioma).toBe("es");
  });

  it("honeypot: { ok: true } sin guardar", async () => {
    await expect(servicio.ejecutar({ texto: "hola mundo", web: "x" }, IP)).resolves.toEqual({ ok: true });
    expect(mensajes.guardados).toHaveLength(0);
  });

  it("límite propio del walkie: el 6.º es 429 espera, sin afectar a /senal", async () => {
    for (let i = 0; i < 5; i++) await servicio.ejecutar({ texto: "hola mundo" }, IP);
    expect(await codigoDe({ texto: "hola mundo" })).toBe("429 espera");
    expect(limites.marcas.every((m) => m.ambito === "walkie")).toBe(true);
  });
});
