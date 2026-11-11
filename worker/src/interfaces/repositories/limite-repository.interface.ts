/** Marcas de envío por huella anónima (epoch en segundos). */
export interface LimiteRepository {
  contarDesde(ambito: string, huella: string, desdeSeg: number): Promise<number>;
  registrar(ambito: string, huella: string, enSeg: number): Promise<void>;
  /** Limpieza oportunista de marcas vencidas. */
  purgarAntesDe(antesSeg: number): Promise<void>;
}
