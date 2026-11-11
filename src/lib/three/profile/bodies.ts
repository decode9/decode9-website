import * as THREE from 'three';
import type { BodyConfig } from '@/interfaces';
import { createLegacyPointLight } from './stage';
import type { SceneBody } from './world';

const BLOCK = 0.17;

/** Builds a voxel glyph from rows of '#' (centred on column 2, row 3). */
const voxelGlyph = (rows: string[], material: THREE.Material, size: number, offsetCols = 0): THREE.Mesh[] => {
  const geo = new THREE.BoxGeometry(size * 0.9, size * 0.9, size * 0.9);
  const out: THREE.Mesh[] = [];
  rows.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch !== '#') return;
      const m = new THREE.Mesh(geo, material);
      m.position.set((c - 2 + offsetCols) * size, (3 - r) * size, 0);
      out.push(m);
    }),
  );
  return out;
};

const glowShell = (radius: number, color: number, opacity: number) =>
  new THREE.Mesh(
    new THREE.SphereGeometry(radius, 48, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );

export interface MysteryHandle extends SceneBody {
  q: THREE.Group;
  wire: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshBasicMaterial>;
  update: (tt: number) => void;
}

/** World 05: dark planet with a floating voxel question mark (contact) — L1666–1686. */
export const createMystery = ({ pos, R }: BodyConfig): MysteryHandle => {
  const group = new THREE.Group();
  group.position.fromArray(pos);
  const spinner = new THREE.Group();
  group.add(spinner);
  const H = (x: number, y: number, z: number) => Math.sin(3 * x + 0.9) * Math.sin(3 * y + 2) * Math.sin(3 * z + 0.4);
  const g = new THREE.IcosahedronGeometry(R, 4);
  const P = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).normalize();
    v.multiplyScalar(R * (1 + 0.03 * H(v.x, v.y, v.z)));
    P.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  spinner.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x3a3d5e, flatShading: true, roughness: 1 })));
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(R * 1.05, 2),
    new THREE.MeshBasicMaterial({ color: 0x9fd8ff, wireframe: true, transparent: true, opacity: 0.2 }),
  );
  spinner.add(wire);
  group.add(glowShell(R * 1.18, 0xffb86b, 0.07));
  const q = new THREE.Group();
  q.add(...voxelGlyph(['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'], new THREE.MeshBasicMaterial({ color: 0xffb86b }), BLOCK));
  q.position.set(0, R + 1.3, 1.1);
  q.rotation.y = Math.PI;
  group.add(q);
  const ql = createLegacyPointLight(0xffb86b, 0.9, 4);
  ql.position.copy(q.position);
  group.add(ql);

  return {
    group,
    spinner,
    q,
    wire,
    R,
    top: R * (1 + 0.03 * H(0, 1, 0)),
    spin: 0,
    update: (tt) => {
      q.rotation.y = Math.PI + Math.sin(tt * 0.6) * 0.35;
      q.position.y = R + 1.3 + Math.sin(tt * 1.1) * 0.08;
      wire.material.opacity = 0.14 + Math.sin(tt * 1.5) * 0.06;
    },
  };
};

export interface AvernoHandle extends SceneBody {
  q: THREE.Group;
  lava: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshBasicMaterial>;
  embers: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[];
  update: (tt: number) => void;
}

const D_ROWS = ['###..', '#..#.', '#...#', '#...#', '#...#', '#..#.', '###..'];
const NINE_ROWS = ['.###.', '#...#', '#...#', '.####', '....#', '#...#', '.###.'];

/** decode9's fire planet with a voxel "d9" and rising embers — L1688–1715. */
export const createAverno = ({ pos, R }: BodyConfig, random: () => number = Math.random): AvernoHandle => {
  const group = new THREE.Group();
  group.position.fromArray(pos);
  const spinner = new THREE.Group();
  group.add(spinner);
  const H = (x: number, y: number, z: number) =>
    Math.sin(3.2 * x + 1.7) * Math.sin(2.8 * y + 0.3) * Math.sin(3.4 * z + 2.2) +
    0.45 * Math.sin(7 * x + 0.4) * Math.sin(6 * y + 2) * Math.sin(8 * z + 1);
  const g = new THREE.IcosahedronGeometry(R, 4);
  const P = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const col: number[] = [];
  const crust = [new THREE.Color(0x1d0a0a), new THREE.Color(0x2c0f0d), new THREE.Color(0x3d1410)];
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).normalize();
    v.multiplyScalar(R * (1 + 0.06 * H(v.x, v.y, v.z)));
    P.setXYZ(i, v.x, v.y, v.z);
    const c = crust[(i * 7) % 3];
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  spinner.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, emissive: 0x2a0402 })));
  // la lava asoma por las grietas (las zonas más bajas de la corteza)
  const lava = new THREE.Mesh(new THREE.IcosahedronGeometry(R * 0.985, 3), new THREE.MeshBasicMaterial({ color: 0xff4a1a }));
  spinner.add(lava);
  group.add(glowShell(R * 1.22, 0xff2a10, 0.16));
  const glowL = createLegacyPointLight(0xff3a1a, 1.4, 9);
  glowL.position.set(0, R * 0.4, R * 1.6);
  group.add(glowL);
  // "d9" en bloques, flotando sobre el planeta
  const q = new THREE.Group();
  const qm = new THREE.MeshBasicMaterial({ color: 0xff5a3a });
  q.add(...voxelGlyph(D_ROWS, qm, 0.15, -3.1), ...voxelGlyph(NINE_ROWS, qm, 0.15, 3.1));
  q.position.set(0, R + 1.35, -1.0);
  group.add(q);
  const ql = createLegacyPointLight(0xff4a2a, 0.9, 4);
  ql.position.copy(q.position);
  group.add(ql);
  // brasas que suben
  const embers: AvernoHandle['embers'] = [];
  const em = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Mesh(em, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xff6a2a : 0xffc04a, transparent: true }));
    m.userData = { a: random() * Math.PI * 2, b: random() * Math.PI, k: random() };
    group.add(m);
    embers.push(m);
  }

  return {
    group,
    spinner,
    q,
    lava,
    embers,
    R,
    top: R * (1 + 0.06 * H(0, 1, 0)),
    spin: 0,
    update: (tt) => {
      q.rotation.y = Math.sin(tt * 0.6) * 0.35;
      q.position.y = R + 1.35 + Math.sin(tt * 1.1) * 0.08;
      lava.material.color.setHSL(0.03 + Math.sin(tt * 1.7) * 0.012, 1, 0.52 + Math.sin(tt * 2.3) * 0.05);
      embers.forEach((m) => {
        const u = m.userData as { a: number; b: number; k: number };
        const ph = (tt * 0.18 + u.k) % 1;
        const r = R * (1.02 + ph * 0.9);
        m.position.set(Math.cos(u.a) * Math.sin(u.b) * r, Math.cos(u.b) * r * 0.6 + ph * 1.2, Math.sin(u.a) * Math.sin(u.b) * r);
        m.material.opacity = 1 - ph;
      });
    },
  };
};
