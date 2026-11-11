import * as THREE from 'three';

/** Thruster flames and code sprites rising from the monitor (L2204–2227, update L2421–2432). */
export interface SceneEffects {
  /** One flame cube at `origin` (world space). */
  spawnFlame: (origin: THREE.Vector3) => void;
  /** One random snippet at `origin` (world position of the monitor). */
  spawnCode: (origin: THREE.Vector3) => void;
  /** Moves, fades and frees the live particles. */
  update: (dt: number) => void;
  dispose: () => void;
}

export interface SceneEffectsDeps {
  parent: THREE.Object3D;
  snippets: readonly string[];
  /** Canvas factory for the code labels (document.createElement('canvas') in the browser). */
  createCanvas: () => HTMLCanvasElement;
  random?: () => number;
  /** Font of the labels; the original uses JetBrains Mono. */
  font?: string;
}

interface Particle<T extends THREE.Object3D> {
  o: T;
  t: number;
  life: number;
  vx: number;
  vz: number;
}

export const createSceneEffects = ({
  parent,
  snippets,
  createCanvas,
  random = Math.random,
  font = '500 34px "JetBrains Mono", monospace',
}: SceneEffectsDeps): SceneEffects => {
  const flameGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  const flames: Particle<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>[] = [];
  const sprites: Particle<THREE.Sprite>[] = [];

  const spawnFlame = (origin: THREE.Vector3) => {
    const m = new THREE.Mesh(
      flameGeo,
      new THREE.MeshBasicMaterial({ color: random() > 0.5 ? 0xffb86b : 0xff7a3d, transparent: true, opacity: 0.9 }),
    );
    m.position.copy(origin);
    parent.add(m);
    flames.push({ o: m, t: 0, life: 0.6 + random() * 0.3, vx: 0, vz: 0 });
  };

  const spawnCode = (origin: THREE.Vector3) => {
    if (!snippets.length) return;
    const txt = snippets[Math.floor(random() * snippets.length)];
    const c = createCanvas();
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(txt).width) + 24;
    c.width = w;
    c.height = 52;
    ctx.font = font;
    ctx.fillStyle = '#9fd8ff';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, 12, 27);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0, depthWrite: false }));
    const h = 0.085;
    sp.scale.set((h * w) / 52, h, 1);
    sp.position.copy(origin).add(new THREE.Vector3((random() - 0.5) * 0.3, 0.18, (random() - 0.5) * 0.3));
    parent.add(sp);
    sprites.push({ o: sp, t: 0, life: 4.2, vx: (random() - 0.5) * 0.18, vz: (random() - 0.5) * 0.12 });
  };

  const freeSprite = (s: THREE.Sprite) => {
    parent.remove(s);
    s.material.map?.dispose();
    s.material.dispose();
  };
  const freeFlame = (m: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>) => {
    parent.remove(m);
    m.material.dispose();
  };

  const update = (dt: number) => {
    for (let i = sprites.length - 1; i >= 0; i--) {
      const s = sprites[i];
      s.t += dt;
      const k = s.t / s.life;
      s.o.position.y += dt * 0.32;
      s.o.position.x += s.vx * dt;
      s.o.position.z += s.vz * dt;
      s.o.material.opacity = Math.sin(Math.min(1, k) * Math.PI) * 0.85;
      if (k >= 1) {
        freeSprite(s.o);
        sprites.splice(i, 1);
      }
    }
    for (let i = flames.length - 1; i >= 0; i--) {
      const m = flames[i];
      m.t += dt;
      const k = m.t / m.life;
      m.o.position.y -= dt * 0.4;
      m.o.scale.setScalar(Math.max(0.01, 1 - k));
      m.o.material.opacity = 0.9 * (1 - k);
      if (k >= 1) {
        freeFlame(m.o);
        flames.splice(i, 1);
      }
    }
  };

  const dispose = () => {
    sprites.splice(0).forEach((s) => freeSprite(s.o));
    flames.splice(0).forEach((m) => freeFlame(m.o));
    flameGeo.dispose();
  };

  return { spawnFlame, spawnCode, update, dispose };
};
