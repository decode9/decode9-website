import * as THREE from 'three';
import type { PropKind } from '@/interfaces';
import type { Primitives } from './primitives';

export type PropMaker = (windowColor?: number) => THREE.Group;
export type PropFactory = Record<PropKind, PropMaker>;

/**
 * Low-poly props scattered over the worlds (`mk(rnd)` of the original, L1426–1495).
 * `rnd` must be the world's seeded generator: the number and order of calls is part of the layout.
 */
export const createPropFactory = (rnd: () => number, { box, registry }: Primitives): PropFactory => {
  const { leds, rotors, steam } = registry;
  return {
    tree() {
      const g = new THREE.Group();
      const s = 0.8 + rnd() * 0.5;
      box(g, 0.04, 0.1 * s, 0.04, 0x6b4630, 0, 0.05 * s, 0);
      box(g, 0.15 * s, 0.12 * s, 0.15 * s, rnd() > 0.5 ? 0x3f8a4e : 0x4e9d58, 0, 0.15 * s, 0);
      box(g, 0.09 * s, 0.07 * s, 0.09 * s, 0x67b56b, 0, 0.24 * s, 0);
      return g;
    },
    pine() {
      const g = new THREE.Group();
      const s = 0.8 + rnd() * 0.5;
      box(g, 0.035, 0.08 * s, 0.035, 0x5a3f2c, 0, 0.04 * s, 0);
      box(g, 0.16 * s, 0.07 * s, 0.16 * s, 0x2f6b4f, 0, 0.11 * s, 0);
      box(g, 0.11 * s, 0.07 * s, 0.11 * s, 0x3a7c5a, 0, 0.18 * s, 0);
      box(g, 0.06 * s, 0.05 * s, 0.06 * s, 0xf2f7ff, 0, 0.24 * s, 0);
      return g;
    },
    rack() {
      const g = new THREE.Group();
      box(g, 0.13, 0.22, 0.09, 0x2c3145, 0, 0.11, 0);
      for (let i = 0; i < 4; i++) leds.push(box(g, 0.02, 0.012, 0.005, i % 2 ? 0x9fd8ff : 0x7fd28e, -0.035, 0.04 + i * 0.045, -0.047, true));
      return g;
    },
    building(win) {
      const g = new THREE.Group();
      const h = 0.2 + rnd() * 0.16;
      const w = win || 0xffcf8a;
      box(g, 0.15, h, 0.15, 0xd9dcef, 0, h / 2, 0);
      for (let y = 0.05; y < h - 0.03; y += 0.06) {
        box(g, 0.1, 0.022, 0.004, w, 0, y, -0.077, true);
        box(g, 0.004, 0.022, 0.1, w, 0.077, y, 0, true);
      }
      box(g, 0.16, 0.02, 0.16, 0x9aa0c4, 0, h + 0.01, 0);
      return g;
    },
    antenna() {
      const g = new THREE.Group();
      box(g, 0.12, 0.03, 0.12, 0x6c7290, 0, 0.015, 0);
      box(g, 0.025, 0.42, 0.025, 0xb9bed8, 0, 0.22, 0);
      box(g, 0.12, 0.015, 0.015, 0xb9bed8, 0, 0.34, 0);
      leds.push(box(g, 0.04, 0.04, 0.04, 0xff7a6b, 0, 0.45, 0, true));
      return g;
    },
    solar() {
      const g = new THREE.Group();
      box(g, 0.025, 0.07, 0.025, 0x9aa0b8, 0, 0.035, 0);
      const p = new THREE.Group();
      p.position.set(0, 0.08, 0);
      p.rotation.x = -0.55;
      g.add(p);
      box(p, 0.2, 0.012, 0.13, 0x1e3a7c, 0, 0, 0);
      box(p, 0.2, 0.014, 0.006, 0x9fd8ff, 0, 0, 0, true);
      box(p, 0.006, 0.014, 0.13, 0x9fd8ff, 0, 0, 0, true);
      return g;
    },
    dome() {
      const g = new THREE.Group();
      box(g, 0.26, 0.025, 0.26, 0x8a8f9f, 0, 0.012, 0);
      const d = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0.5, roughness: 0.2, flatShading: true }),
      );
      d.position.y = 0.025;
      g.add(d);
      box(g, 0.05, 0.05, 0.05, 0x6dbb70, -0.03, 0.05, 0);
      box(g, 0.04, 0.04, 0.04, 0xffcf8a, 0.04, 0.045, 0.02, true);
      return g;
    },
    extractor() {
      const g = new THREE.Group();
      box(g, 0.08, 0.18, 0.08, 0xcfd3e2, 0, 0.09, 0);
      box(g, 0.084, 0.025, 0.084, 0x3fb3a8, 0, 0.12, 0, true);
      box(g, 0.1, 0.03, 0.1, 0x8a8f9f, 0, 0.195, 0);
      return g;
    },
    turbine() {
      const g = new THREE.Group();
      box(g, 0.025, 0.4, 0.025, 0xe8edf7, 0, 0.2, 0);
      box(g, 0.05, 0.045, 0.08, 0xe8edf7, 0, 0.41, 0);
      const r = new THREE.Group();
      r.position.set(0, 0.41, -0.045);
      g.add(r);
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Group();
        b.rotation.z = i * 2.094;
        r.add(b);
        box(b, 0.022, 0.17, 0.008, 0xf6f9ff, 0, 0.085, 0);
      }
      r.userData.speed = 2.5 + rnd() * 1.5;
      rotors.push(r);
      return g;
    },
    datacenter() {
      const g = new THREE.Group();
      box(g, 0.26, 0.09, 0.13, 0xe2e7f2, 0, 0.045, 0);
      leds.push(box(g, 0.22, 0.012, 0.004, 0x7dffc4, 0, 0.06, -0.066, true));
      leds.push(box(g, 0.22, 0.012, 0.004, 0x9fd8ff, 0, 0.035, -0.066, true));
      box(g, 0.06, 0.03, 0.06, 0x9aa0b8, 0.07, 0.105, 0);
      return g;
    },
    geoplant() {
      const g = new THREE.Group();
      box(g, 0.15, 0.1, 0.12, 0x5b5f6e, 0, 0.05, 0);
      box(g, 0.045, 0.2, 0.045, 0x7a7f90, 0.04, 0.12, 0.02);
      box(g, 0.155, 0.02, 0.02, 0xff8a3d, 0, 0.07, -0.061, true);
      for (let k = 0; k < 3; k++) {
        const s = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.05, 0.05),
          new THREE.MeshBasicMaterial({ color: 0xf2f2f7, transparent: true, opacity: 0.6 }),
        );
        s.position.set(0.04, 0.24, 0.02);
        g.add(s);
        steam.push({ m: s, k: k / 3 });
      }
      return g;
    },
    table() {
      const g = new THREE.Group();
      box(g, 0.22, 0.02, 0.22, 0x8a5a3c, 0, 0.06, 0);
      box(g, 0.04, 0.06, 0.04, 0x5d3c28, 0, 0.03, 0);
      box(g, 0.012, 0.16, 0.012, 0xb9bed8, 0.08, 0.14, 0.08);
      box(g, 0.07, 0.045, 0.004, 0xffb86b, 0.115, 0.2, 0.08, true);
      leds.push(box(g, 0.03, 0.03, 0.03, 0xffe2b8, 0, 0.085, 0, true));
      return g;
    },
    crate() {
      const g = new THREE.Group();
      const c = new THREE.Group();
      g.add(c);
      c.rotation.set((rnd() - 0.5) * 0.9, (rnd() - 0.5) * 1.2, (rnd() - 0.5) * 0.9);
      box(c, 0.08, 0.08, 0.08, rnd() > 0.5 ? 0xb98a52 : 0x9a7042, 0, 0.04, 0);
      box(c, 0.084, 0.012, 0.084, 0x6b4630, 0, 0.04, 0);
      return g;
    },
    crystal() {
      const g = new THREE.Group();
      const s = 0.7 + rnd() * 0.6;
      const m = new THREE.MeshBasicMaterial({ color: 0xc58bff, transparent: true, opacity: 0.85 });
      (
        [
          [0, 0, 0, 0.16],
          [0.04, 0, 0.02, 0.1],
          [-0.035, 0, -0.02, 0.08],
        ] as const
      ).forEach(([x, , z, h]) => {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.035 * s, h * s, 0.035 * s), m);
        c.position.set(x, (h * s) / 2, z);
        c.rotation.z = x * 4;
        g.add(c);
      });
      return g;
    },
  };
};
