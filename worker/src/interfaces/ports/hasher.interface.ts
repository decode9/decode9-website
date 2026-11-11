export interface Hasher {
  /** SHA-256 en hexadecimal (64 caracteres). */
  sha256Hex(texto: string): Promise<string>;
}
