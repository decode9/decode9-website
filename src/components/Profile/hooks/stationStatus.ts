import type { StationStatus } from '../interface';

/** What the stage reports every frame (mirrors StageReadout of the 3D runtime). */
export interface StationReadout {
  index: number;
  countdown: number;
  flying: boolean;
  progress: number[];
  /** Terraform phase (0–3) of the current world. */
  phase: number;
  night: string | null;
}

export interface StatusWorld {
  name: string;
  phases: readonly [string, string, string, string];
}

/**
 * setStatus of the original (L2262–2286) as a pure function: readout → dial/footer status plus the
 * dedupe key (stKey). Worlds first, then the mystery (index = worlds.length), then the Averno.
 */
export const formatStatus = (r: StationReadout, worlds: readonly StatusWorld[]): { key: string; status: StationStatus } => {
  const NW = worlds.length;
  const pcts = r.progress.map((p) => Math.round(p * 100));
  const done = r.progress.map((p) => p >= 1);
  const base = { index: r.index, done };
  if (r.index < NW) {
    const p = r.progress[r.index] ?? 0;
    const pct = pcts[r.index] ?? 0;
    const phase = r.night ?? (r.flying ? 'en órbita' : r.countdown ? `viajando al siguiente mundo en ${r.countdown}…` : p >= 1 ? 'mundo terraformado' : `terraformando · ${worlds[r.index].phases[r.phase] ?? worlds[r.index].phases[0]}`);
    return {
      key: `${r.index}|${pct}|${phase}|${done.join('')}`,
      status: { ...base, name: worlds[r.index].name, phase, pct: `${pct}%`, progress: pct, replayDisabled: r.flying },
    };
  }
  if (r.index > NW) {
    return {
      key: `d9|${r.flying}|${done.join('')}`,
      status: { ...base, name: 'Averno', phase: r.flying ? 'en órbita' : 'abriendo decode9', pct: 'd9', progress: 0, replayDisabled: true },
    };
  }
  return {
    key: `m|${r.flying}|${done.join('')}`,
    status: { ...base, name: 'Por descubrir', phase: r.flying ? 'en órbita' : 'esperando tu idea', pct: '?', progress: 0, replayDisabled: true },
  };
};
