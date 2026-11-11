import type { Hasher } from "../../interfaces/ports/hasher.interface.js";

export const createWebCryptoHasher = (): Hasher => ({
  async sha256Hex(texto) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  },
});
