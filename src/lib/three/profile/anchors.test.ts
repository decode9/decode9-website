import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { computeAnchors } from './anchors';

const body = (x: number, y: number, z: number, R = 2, top = 2) => ({ group: { position: new THREE.Vector3(x, y, z) }, R, top });

describe('computeAnchors', () => {
  const bodies = [body(0, 0, 0), body(10, 0, 0), body(20, 0, 0, 1.7, 1.7), body(30, 0, 0, 1.8, 1.8)];

  it('places Jorge on the north pole of each stop', () => {
    const a = computeAnchors(bodies, 2, 1.6, 900);
    expect(a.map((x) => x.jorge.toArray())).toEqual([
      [0, 1.99, 0],
      [10, 1.99, 0],
      [20, 1.69, 0],
      [30, 1.79, 0],
    ]);
  });

  it('frames the first world from the front, shifted left on wide screens (desktop 16:10)', () => {
    const [a] = computeAnchors(bodies, 2, 1.6, 900);
    // s = R/2 = 1, k = 1.14, lat = 1.3, right = +x
    expect(a.cam.x).toBeCloseTo(-1.3);
    expect(a.cam.y).toBeCloseTo(3 * 1.14);
    expect(a.cam.z).toBeCloseTo(8.4 * 1.14);
    expect(a.look.y).toBeCloseTo(0.55 + 0.2);
    expect(a.yaw).toBeCloseTo(0.9);
  });

  it('looks at the mystery from behind and the averno with its own yaw', () => {
    const a = computeAnchors(bodies, 2, 1.6, 900);
    expect(a[2].cam.z).toBeLessThan(0);
    expect(a[2].yaw).toBeCloseTo(0.9 + Math.PI);
    expect(a[3].yaw).toBeCloseTo(0.5);
  });

  it('backs off in portrait and on short screens', () => {
    const tall = computeAnchors(bodies, 2, 0.5, 900)[0];
    const short = computeAnchors(bodies, 2, 0.5, 700)[0];
    expect(tall.cam.z).toBeCloseTo(8.4 * 2.6);
    expect(short.cam.z).toBeCloseTo(8.4 * 2.95);
    expect(tall.cam.x).toBe(0);
  });
});
