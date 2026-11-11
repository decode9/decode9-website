import type { Senal } from "../domain/senal.js";

export interface SenalRepository {
  guardar(senal: Senal): Promise<void>;
}
