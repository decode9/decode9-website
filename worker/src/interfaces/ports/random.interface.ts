export interface Random {
  /** Entero uniforme en [min, max], ambos incluidos. */
  entero(min: number, max: number): number;
}
