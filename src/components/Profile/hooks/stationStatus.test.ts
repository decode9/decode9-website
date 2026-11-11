import { describe, expect, it } from 'vitest';
import { formatStatus, type StationReadout } from './stationStatus';

const WORLDS = [
  { name: 'Origen', phases: ['Suelo', 'Agua', 'Vida', 'Red'] as const },
  { name: 'Segundo', phases: ['A', 'B', 'C', 'D'] as const },
];
const r = (o: Partial<StationReadout>): StationReadout => ({ index: 0, countdown: 0, flying: false, progress: [0.3, 1], phase: 1, night: null, ...o });

describe('formatStatus', () => {
  it('shows the terraform phase and percentage of a world', () => {
    const { status } = formatStatus(r({}), WORLDS);
    expect(status).toMatchObject({ name: 'Origen', phase: 'terraformando · Agua', pct: '30%', progress: 30, replayDisabled: false, done: [false, true] });
  });

  it('prioritises night, flight and countdown labels', () => {
    expect(formatStatus(r({ night: 'durmiendo' }), WORLDS).status.phase).toBe('durmiendo');
    expect(formatStatus(r({ flying: true }), WORLDS).status).toMatchObject({ phase: 'en órbita', replayDisabled: true });
    expect(formatStatus(r({ index: 1, countdown: 2 }), WORLDS).status.phase).toBe('viajando al siguiente mundo en 2…');
    expect(formatStatus(r({ index: 1 }), WORLDS).status.phase).toBe('mundo terraformado');
  });

  it('describes the mystery and the Averno', () => {
    expect(formatStatus(r({ index: 2 }), WORLDS).status).toMatchObject({ name: 'Por descubrir', phase: 'esperando tu idea', pct: '?' });
    expect(formatStatus(r({ index: 3 }), WORLDS).status).toMatchObject({ name: 'Averno', phase: 'abriendo decode9', pct: 'd9' });
  });

  it('keeps the same key while nothing visible changes', () => {
    expect(formatStatus(r({ progress: [0.301, 1] }), WORLDS).key).toBe(formatStatus(r({ progress: [0.302, 1] }), WORLDS).key);
    expect(formatStatus(r({ progress: [0.31, 1] }), WORLDS).key).not.toBe(formatStatus(r({}), WORLDS).key);
  });
});
