import { beforeEach, describe, expect, it } from "vitest";
import { createLimiteEnvios } from "../src/services/limite/limite-envios.service.js";
import { createRegistrarSenal } from "../src/services/senal/registrar-senal.service.js";
import { AppError } from "../src/utils/shared/app-error.util.js";
import {
  CollectingTasks,
  FixedClock,
  MemoryLimiteRepository,
  MemorySenalRepository,
  RecordingNotifier,
  fakeHasher,
  fixedRandom,
} from "./fakes/ports.fake.js";

const IP = "203.0.113.7";
const valida = { alias: "Neo", email: "neo@zion.io", msg: "hola", origen: "movil", lang: "es", topics: ["web", "app"] };

describe("RegistrarSenal (POST /senal)", () => {
  let senales: MemorySenalRepository;
  let limites: MemoryLimiteRepository;
  let notifier: RecordingNotifier;
  let tareas: CollectingTasks;
  let clock: FixedClock;
  let servicio: ReturnType<typeof createRegistrarSenal>;

  beforeEach(() => {
    senales = new MemorySenalRepository();
    limites = new MemoryLimiteRepository();
    notifier = new RecordingNotifier();
    tareas = new CollectingTasks();
    clock = new FixedClock();
    const limite = createLimiteEnvios({ repo: limites, hasher: fakeHasher, clock, salt: "sal", max: 5, ventanaSeg: 600 });
    servicio = createRegistrarSenal({ senales, limite, random: fixedRandom(4242), clock, notifier, tareas });
  });

  const errorDe = async (entrada: Record<string, unknown>, ip = IP) => {
    try {
      await servicio.ejecutar(entrada, ip);
    } catch (e) {
      if (e instanceof AppError) return { status: e.statusCode, code: e.code };
      throw e;
    }
    return null;
  };

  it("guarda la señal limpia y responde con código SOS-####", async () => {
    const r = await servicio.ejecutar({ ...valida, alias: "  <b>Neo</b>  ", msg: "ho\u0007la" }, IP);
    expect(r).toEqual({ ok: true, code: "SOS-4242" });
    expect(senales.guardadas).toHaveLength(1);
    expect(senales.guardadas[0]).toMatchObject({
      codigo: "SOS-4242",
      fecha: "2026-11-11T12:00:00+00:00",
      origen: "movil",
      idioma: "es",
      alias: "Neo",
      correo: "neo@zion.io",
      whatsapp: "",
      temas: ["web", "app"],
      mensaje: "ho la",
    });
    expect(senales.guardadas[0]?.huella).toHaveLength(16);
  });

  it("avisa en segundo plano con reply-to al correo", async () => {
    await servicio.ejecutar(valida, IP);
    await tareas.terminar();
    expect(notifier.avisos[0]?.asunto).toBe("decode9 · nueva señal SOS-4242 de Neo");
    expect(notifier.avisos[0]?.responderA).toBe("neo@zion.io");
    expect(notifier.avisos[0]?.texto).toContain("Temas: web, app");
  });

  it("un fallo del correo no rompe la respuesta", async () => {
    notifier.falla = true;
    await expect(servicio.ejecutar(valida, IP)).resolves.toEqual({ ok: true, code: "SOS-4242" });
    await expect(tareas.terminar()).resolves.toBeDefined();
  });

  it("honeypot `web` lleno: éxito falso, no guarda ni cuenta", async () => {
    const r = await servicio.ejecutar({ ...valida, web: "http://spam" }, IP);
    expect(r.ok).toBe(true);
    expect(r.code).toMatch(/^SOS-\d{4}$/);
    expect(senales.guardadas).toHaveLength(0);
    expect(limites.marcas).toHaveLength(0);
  });

  it("honeypot vacío o \"0\" no cuenta como robot (empty() de PHP)", async () => {
    await servicio.ejecutar({ ...valida, web: "" }, IP);
    await servicio.ejecutar({ ...valida, web: "0" }, IP);
    expect(senales.guardadas).toHaveLength(2);
  });

  it.each([
    [{ ...valida, alias: "N" }, "alias"],
    [{ ...valida, alias: undefined }, "alias"],
    [{ ...valida, email: "no-es-correo" }, "correo"],
    [{ ...valida, whatsapp: "12ab" }, "whatsapp"],
    [{ ...valida, whatsapp: "123" }, "whatsapp"],
    [{ alias: "Neo" }, "regreso"],
    [{ alias: "Neo", email: "  ", whatsapp: "" }, "regreso"],
  ])("rechaza %j con 422 %s", async (entrada, code) => {
    expect(await errorDe(entrada as Record<string, unknown>)).toEqual({ status: 422, code });
    expect(senales.guardadas).toHaveLength(0);
  });

  it("acepta solo WhatsApp válido", async () => {
    await servicio.ejecutar({ alias: "Neo", whatsapp: "+58 412-555 1234" }, IP);
    expect(senales.guardadas[0]?.whatsapp).toBe("+58 412-555 1234");
  });

  it("recorta textos largos, origen desconocido → escritorio, máx. 10 temas, lang por defecto es", async () => {
    await servicio.ejecutar(
      {
        alias: "a".repeat(60),
        email: "neo@zion.io",
        msg: "m".repeat(900),
        origen: "tablet",
        topics: Array.from({ length: 15 }, (_, i) => `t${i}${"x".repeat(50)}`),
      },
      IP,
    );
    const s = senales.guardadas[0];
    expect(s?.alias).toHaveLength(40);
    expect(s?.mensaje).toHaveLength(500);
    expect(s?.origen).toBe("escritorio");
    expect(s?.idioma).toBe("es");
    expect(s?.temas).toHaveLength(10);
    expect(s?.temas[0]).toHaveLength(40);
  });

  it("límite: 5 envíos cada 10 min por IP; el 6.º es 429 espera", async () => {
    for (let i = 0; i < 5; i++) await servicio.ejecutar(valida, IP);
    expect(await errorDe(valida)).toEqual({ status: 429, code: "espera" });
    // otra IP no comparte cupo
    await expect(servicio.ejecutar(valida, "198.51.100.1")).resolves.toMatchObject({ ok: true });
    // pasada la ventana se libera
    clock.avanzar(601);
    await expect(servicio.ejecutar(valida, IP)).resolves.toMatchObject({ ok: true });
  });

  it("los errores de validación no consumen cupo", async () => {
    for (let i = 0; i < 7; i++) await errorDe({ alias: "N" });
    expect(limites.marcas).toHaveLength(0);
  });

  it("si D1 falla al guardar responde 500 almacenamiento", async () => {
    senales.falla = true;
    expect(await errorDe(valida)).toEqual({ status: 500, code: "almacenamiento" });
  });
});
