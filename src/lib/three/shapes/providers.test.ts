import { describe, expect, it } from 'vitest';
import { createRandom } from '@/utils/math';
import createShapeRegistry from './registry';
import { insidePolygon, isotype } from './isotype';
import { CONSTELLATION_NODES, constellationNode, proceduralShapes } from './providers';

describe('procedural shapes', () => {
  it.each(proceduralShapes.map((provider) => [provider.id, provider] as const))(
    '%s builds finite positions for every particle',
    (_id, provider) => {
      const positions = provider.build(500, createRandom(1));
      expect(positions).toHaveLength(1500);
      expect(Array.from(positions).every(Number.isFinite)).toBe(true);
    },
  );

  it('samples the isotype inside its 3.2-unit tall, centred silhouette', () => {
    const positions = isotype.build(2000, createRandom(3));
    const ys = Array.from(positions).filter((_, index) => index % 3 === 1);
    expect(Math.max(...ys)).toBeLessThanOrEqual(1.61);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-1.61);
    expect(Math.abs(ys.reduce((sum, y) => sum + y, 0) / ys.length)).toBeLessThan(0.5);
  });

  it('knows when a point is inside a polygon', () => {
    const square: [number, number][] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    expect(insidePolygon([0.5, 0.5], square)).toBe(true);
    expect(insidePolygon([1.5, 0.5], square)).toBe(false);
  });

  it('places constellation nodes on a ring', () => {
    const radii = Array.from({ length: CONSTELLATION_NODES }, (_, index) => Math.hypot(...constellationNode(index)));
    radii.forEach((radius) => expect(radius).toBeCloseTo(2.8, 5));
  });
});

describe('createShapeRegistry', () => {
  it('builds lazily, deterministically, and accepts late providers', () => {
    const registry = createShapeRegistry(100, proceduralShapes);
    expect(registry.get('helix')).toBe(registry.get('helix'));
    expect(Array.from(registry.get('helix')!)).toEqual(
      Array.from(createShapeRegistry(100, proceduralShapes).get('helix')!),
    );
    expect(registry.get('isotype')).toHaveLength(300);
    const custom = new Float32Array(300);
    registry.register({ id: 'isotype', build: () => custom });
    expect(registry.get('isotype')).toBe(custom);
  });
});
