import { describe, expect, it } from 'vitest';
import { WORLDS } from '@/data/profile/worlds';
import { createPrimitives } from './primitives';
import { createMystery } from './bodies';
import { createBridges } from './bridges';
import { buildWorld } from './world';

describe('buildWorld', () => {
  it('scatters props deterministically and grows them with progress', () => {
    const make = () => buildWorld(WORLDS[0], 0, { primitives: createPrimitives(), reduce: false });
    const a = make();
    const b = make();
    expect(a.items.length).toBe(b.items.length);
    expect(a.items[5].n.toArray()).toEqual(b.items[5].n.toArray());
    expect(a.items.length).toBeGreaterThan(40);
    a.p = 0;
    a.update(0.016, 0);
    expect(a.items.every((it) => it.o.scale.x === 0.0001)).toBe(true);
    a.p = 1;
    a.update(0.016, 0);
    expect(a.items.every((it) => it.o.scale.x === 1)).toBe(true);
    expect(a.linkMat.opacity).toBeCloseTo(0.55);
  });

  it('starts terraformed with reduced motion and adds crew + aurora when configured', () => {
    const prims = createPrimitives();
    const colonia = buildWorld(WORLDS[4], 4, { primitives: prims, reduce: true });
    expect(colonia.p).toBe(1);
    expect(colonia.items.some((i) => i.hub)).toBe(true);
    const hielo = buildWorld(WORLDS[2], 2, { primitives: prims, reduce: false });
    expect(hielo.aurora).not.toBeNull();
    expect(colonia.aurora).toBeNull();
    expect(prims.registry.rotors.length).toBe(10);
  });

  it('links consecutive stops, dashed after the last world', () => {
    const prims = createPrimitives();
    const worlds = WORLDS.map((cfg, i) => buildWorld(cfg, i, { primitives: prims, reduce: false }));
    const bodies = [...worlds, createMystery({ pos: [13, 28, -76], R: 1.7 }), createMystery({ pos: [-9, 35, -94], R: 1.8 })];
    const { bridges, update } = createBridges(bodies, worlds.length, false);
    expect(bridges.map((b) => b.pending)).toEqual([false, false, false, false, true, true]);
    worlds[0].p = 1;
    worlds[1].p = 1;
    for (let i = 0; i < 200; i++) update(0.05, i * 0.05, (k) => worlds[k].p >= 1);
    expect(bridges[0].alpha).toBeCloseTo(0.6, 2);
    expect(bridges[1].alpha).toBe(0);
  });
});
