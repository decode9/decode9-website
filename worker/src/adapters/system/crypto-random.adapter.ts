import type { Random } from "../../interfaces/ports/random.interface.js";

/** Azar criptográfico (como `random_int` de PHP). */
export const createCryptoRandom = (): Random => ({
  entero(min, max) {
    const rango = max - min + 1;
    const limite = Math.floor(0x1_0000_0000 / rango) * rango;
    const buf = new Uint32Array(1);
    do crypto.getRandomValues(buf);
    while ((buf[0] ?? 0) >= limite);
    return min + ((buf[0] ?? 0) % rango);
  },
});
