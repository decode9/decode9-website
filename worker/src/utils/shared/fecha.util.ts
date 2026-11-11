/** ISO 8601 con segundos y `+00:00`, el mismo formato que `date('c')` de PHP en UTC. */
export const isoSegundos = (fecha: Date): string => fecha.toISOString().replace(/\.\d{3}Z$/, "+00:00");
