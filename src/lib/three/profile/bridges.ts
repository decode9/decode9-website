import * as THREE from 'three';
import type { SceneBody } from './world';

export interface Bridge {
  a: number;
  b: number;
  curve: THREE.QuadraticBezierCurve3;
  line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial | THREE.LineDashedMaterial>;
  pulses: { p: THREE.Mesh; o: number }[];
  /** Eased opacity of a solid bridge. */
  alpha: number;
  /** Dashed: leads to a stop that is not a terraformable world (mystery, averno). */
  pending: boolean;
}

export interface BridgesHandle {
  bridges: Bridge[];
  root: THREE.Group;
  /**
   * @param done progress-complete flag per world index (`worlds[i].p >= 1`)
   */
  update: (dt: number, tt: number, done: (i: number) => boolean) => void;
}

/**
 * Arcs between consecutive stops (L1720–1735). Solid and pulsing once both worlds are
 * terraformed; dashed (orange, red towards the averno) for the last two hops.
 */
export const createBridges = (bodies: SceneBody[], worldCount: number, reduce: boolean): BridgesHandle => {
  const root = new THREE.Group();
  const bridges: Bridge[] = [];
  for (let i = 0; i < bodies.length - 1; i++) {
    const a = bodies[i];
    const b = bodies[i + 1];
    const pending = i >= worldCount - 1;
    const toD9 = i === worldCount;
    const A = a.group.position.clone();
    const B = b.group.position.clone();
    const d = B.clone().sub(A).normalize();
    const s = A.clone().add(d.clone().multiplyScalar(a.R * 1.1));
    const e = B.clone().sub(d.clone().multiplyScalar(b.R * 1.1));
    const ctrl = s.clone().add(e).multiplyScalar(0.5).add(new THREE.Vector3(0, 3.5, 0));
    const curve = new THREE.QuadraticBezierCurve3(s, ctrl, e);
    const m = pending
      ? new THREE.LineDashedMaterial({ color: toD9 ? 0xff3a22 : 0xffb86b, dashSize: 0.35, gapSize: 0.3, transparent: true, opacity: 0 })
      : new THREE.LineBasicMaterial({ color: 0xffc98f, transparent: true, opacity: 0 });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)), m);
    if (pending) line.computeLineDistances();
    root.add(line);
    const pulses = pending
      ? []
      : [0, 0.5].map((o) => {
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe2b8 }));
          p.visible = false;
          root.add(p);
          return { p, o };
        });
    bridges.push({ a: i, b: i + 1, curve, line, pulses, alpha: 0, pending });
  }

  const update: BridgesHandle['update'] = (dt, tt, done) => {
    bridges.forEach((br) => {
      const mat = br.line.material;
      if (br.pending) {
        const ready = done(worldCount - 1) ? 0.25 : 0;
        mat.opacity = reduce ? 0.3 : 0.18 + ready + Math.sin(tt * 2) * 0.08;
        return;
      }
      const target = done(br.a) && done(br.b) ? 0.6 : 0;
      br.alpha += (target - br.alpha) * Math.min(1, dt * 2);
      mat.opacity = br.alpha;
      br.pulses.forEach(({ p, o }) => {
        p.visible = br.alpha > 0.3;
        if (p.visible) p.position.copy(br.curve.getPoint((tt * 0.12 + o) % 1));
      });
    });
  };

  return { bridges, root, update };
};
