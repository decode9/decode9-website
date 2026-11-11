import { describe, expect, it } from "vitest";
import { createApp } from "../src/bootstrap/app.js";
import type { ApiControllers } from "../src/controllers/api-controllers.js";
import { SolicitudInvalidaError } from "../src/utils/shared/app-error.util.js";

const ORIGEN = "https://decode9.codes";
const controllers = (): ApiControllers => ({
  senal: { registrar: async (c) => c.json({ ok: true, code: "SOS-1234" }) },
  walkie: {
    registrar: async () => {
      throw new SolicitudInvalidaError("vacio");
    },
  },
  noticias: { listar: async (c) => { c.header("Cache-Control", "public, max-age=600"); return c.json({ ok: true, actualizado: "", noticias: [] }); } },
});
const app = createApp({ controllers, allowedOrigins: () => [ORIGEN, "http://localhost:3000"] });

describe("rutas y middleware", () => {
  it("CORS solo para orígenes permitidos", async () => {
    const ok = await app.request("/senal", { method: "POST", headers: { Origin: ORIGEN }, body: "{}" });
    expect(ok.headers.get("Access-Control-Allow-Origin")).toBe(ORIGEN);
    const no = await app.request("/senal", { method: "POST", headers: { Origin: "https://evil.example" }, body: "{}" });
    expect(no.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("preflight OPTIONS responde 204 con métodos", async () => {
    const r = await app.request("/walkie", {
      method: "OPTIONS",
      headers: { Origin: ORIGEN, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" },
    });
    expect(r.status).toBe(204);
    expect(r.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("errores de dominio como { ok:false, error } con su HTTP", async () => {
    const r = await app.request("/walkie", { method: "POST", body: "{}" });
    expect(r.status).toBe(422);
    expect(await r.json()).toEqual({ ok: false, error: "vacio" });
    expect(r.headers.get("Cache-Control")).toBe("no-store");
    expect(r.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("método equivocado → 405 metodo; ruta desconocida → 404 ruta", async () => {
    const m = await app.request("/senal");
    expect(m.status).toBe(405);
    expect(await m.json()).toEqual({ ok: false, error: "metodo" });
    const n = await app.request("/nada");
    expect(n.status).toBe(404);
    expect(await n.json()).toEqual({ ok: false, error: "ruta" });
  });

  it("/noticias conserva su Cache-Control público", async () => {
    const r = await app.request("/noticias");
    expect(r.headers.get("Cache-Control")).toBe("public, max-age=600");
  });

  it("cuerpo de más de 16 KB → 413 tamano", async () => {
    const r = await app.request("/senal", { method: "POST", body: "x".repeat(17 * 1024), headers: { "Content-Length": String(17 * 1024) } });
    expect(r.status).toBe(413);
    expect(await r.json()).toEqual({ ok: false, error: "tamano" });
  });
});
