import * as THREE from 'three';
import type { ScreenRect, SunScreenState, ViewportSize } from '@/interfaces';

export interface MoonHandle {
  g: THREE.Group;
  m: THREE.Mesh;
  update: (dt: number, tt: number) => void;
  /**
   * Pins the moon 4 units in front of the camera, behind the "About" DOM button (`#moonHit`).
   * Call after `camera.updateMatrixWorld()`.
   */
  place: (rect: ScreenRect, viewport: ViewportSize, camera: THREE.PerspectiveCamera) => void;
}

/** Low-poly cratered moon that lives in screen space (L1350–1377). */
export const createMoon = (): MoonHandle => {
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const P = geo.attributes.position as THREE.BufferAttribute;
  const n = P.count;
  const cl = new Float32Array(n * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(P, i).normalize();
    const bump = 1 + 0.05 * Math.sin(v.x * 7 + 1) * Math.sin(v.y * 6) * Math.sin(v.z * 5 + 2);
    v.multiplyScalar(bump);
    P.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const tones = [0xdfe3ef, 0xcdd2e2, 0xe9ecf6, 0xb9bfd3].map((h) => new THREE.Color(h));
  const crater = new THREE.Color(0x8d93ab);
  for (let f = 0; f < n / 3; f++) {
    v.fromBufferAttribute(P, f * 3).normalize();
    const isCrater = Math.sin(v.x * 9.1) * Math.sin(v.y * 8.3 + 1.2) * Math.sin(v.z * 7.7 + 0.4) > 0.32;
    const c = isCrater ? crater : tones[(f * 5 + (f >> 3)) % tones.length];
    for (let k = 0; k < 3; k++) cl.set([c.r, c.g, c.b], (f * 3 + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cl, 3));
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, metalness: 0, emissive: 0x1c2030 }));
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.28, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xcfd8ff, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const g = new THREE.Group();
  g.add(m, glow);
  g.renderOrder = 10;

  const moonV = new THREE.Vector3();
  const place: MoonHandle['place'] = (r, { width: W, height: H }, camera) => {
    if (!r.width) return;
    const d = 4;
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * d;
    const halfW = halfH * camera.aspect;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    moonV.set((cx / W) * 2 * halfW - halfW, -((cy / H) * 2 - 1) * halfH, -d).applyMatrix4(camera.matrixWorld);
    g.position.copy(moonV);
    g.scale.setScalar(((r.width * 0.36) / H) * 2 * halfH);
  };

  const update = (dt: number, tt: number) => {
    m.rotation.y += dt * 0.12;
    m.rotation.x = Math.sin(tt * 0.2) * 0.15;
  };

  return { g, m, update, place };
};

export interface SunHandle {
  /** Sun body: mesh, corona and flares. */
  g: THREE.Group;
  mesh: THREE.Mesh;
  corona: THREE.Sprite;
  flares: THREE.Group;
  /** Logo layer, positioned at the sun but outside `g` (spins on its own). */
  logoG: THREE.Group;
  spinL: THREE.Group;
  position: THREE.Vector3;
  R: number;
  update: (dt: number, tt: number, reduce: boolean) => void;
  /**
   * Where the sun link goes. Re-checks every 12 calls whether a world hides it
   * (raycast against `occluders`, as the original). Call after the camera moved.
   */
  screenState: (camera: THREE.PerspectiveCamera, viewport: ViewportSize, occluders: THREE.Object3D[]) => SunScreenState;
}

export interface SunDeps {
  position: THREE.Vector3;
  R: number;
  /** PNG with the [e} mark (sol-empire.png). */
  logoUrl: string;
  random?: () => number;
}

const coronaTexture = (): THREE.CanvasTexture => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const cx = cv.getContext('2d');
  if (cx) {
    const gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,220,110,.95)');
    gr.addColorStop(0.32, 'rgba(255,190,80,.55)');
    gr.addColorStop(0.6, 'rgba(255,150,60,.16)');
    gr.addColorStop(1, 'rgba(255,140,60,0)');
    cx.fillStyle = gr;
    cx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(cv);
};

/** The Empire's sun with its corona, block flares and orbiting logo (L1378–1412). */
export const createSun = ({ position, R, logoUrl, random = Math.random }: SunDeps): SunHandle => {
  const g = new THREE.Group();
  g.position.copy(position);
  const geo = new THREE.IcosahedronGeometry(R, 2);
  const n = geo.attributes.position.count;
  const cl = new Float32Array(n * 3);
  const tones = [0xffd23f, 0xffc130, 0xffe066, 0xffb52e].map((h) => new THREE.Color(h));
  for (let f = 0; f < n / 3; f++) {
    const c = tones[(f * 7 + (f >> 2)) % tones.length];
    for (let k = 0; k < 3; k++) cl.set([c.r, c.g, c.b], (f * 3 + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cl, 3));
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true }));
  g.add(mesh);
  const corona = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: coronaTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  corona.scale.setScalar(R * 5.2);
  g.add(corona);
  // llamaradas en bloques que orbitan el sol
  const flares = new THREE.Group();
  g.add(flares);
  const fc = [0xffd23f, 0xff9a3d, 0xffe066];
  for (let i = 0; i < 30; i++) {
    const s = 0.5 + random() * 0.9;
    const d = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshBasicMaterial({ color: fc[i % 3], transparent: true, opacity: 0.9 }));
    m.position.copy(d).multiplyScalar(R * (1.12 + random() * 0.35));
    m.rotation.set(random() * 3, random() * 3, 0);
    m.userData = { ph: random() * 6, base: m.position.clone() };
    flares.add(m);
  }
  // la marca [e} como una capa sobre la superficie, que orbita alrededor del sol
  const lt = new THREE.TextureLoader().load(logoUrl);
  lt.anisotropy = 4;
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.015, 48, 32, -0.575, 1.15, Math.PI / 2 - 0.46, 0.92),
    new THREE.MeshBasicMaterial({ map: lt, transparent: true, depthWrite: false }),
  );
  const logoG = new THREE.Group();
  logoG.position.copy(position);
  logoG.rotation.z = 0.18;
  const spinL = new THREE.Group();
  logoG.add(spinL);
  spinL.add(shell);

  const update: SunHandle['update'] = (dt, tt, reduce) => {
    if (!reduce) {
      mesh.rotation.y += dt * 0.06;
      flares.rotation.y -= dt * 0.04;
      flares.rotation.x += dt * 0.015;
      corona.scale.setScalar(R * (5.2 + Math.sin(tt * 1.3) * 0.25));
      flares.children.forEach((m) => {
        const k = 1 + Math.sin(tt * 1.5 + (m.userData.ph as number)) * 0.08;
        m.position.copy(m.userData.base as THREE.Vector3).multiplyScalar(k);
      });
    }
    // la marca gira sin parar sobre el sol; a veces queda del otro lado
    spinL.rotation.y += reduce ? 0 : dt * 0.22;
    logoG.rotation.x = reduce ? 0 : Math.sin(tt * 0.25) * 0.12;
  };

  const sunV = new THREE.Vector3();
  const sunV2 = new THREE.Vector3();
  const ray = new THREE.Raycaster();
  let tick = 0;
  let blocked = false;
  const screenState: SunHandle['screenState'] = (camera, { width, height }, occluders) => {
    sunV.copy(position).project(camera);
    const onScreen = sunV.z < 1 && Math.abs(sunV.x) < 1.05 && Math.abs(sunV.y) < 1.05;
    if (++tick % 12 === 0) {
      ray.set(camera.position, sunV2.copy(position).sub(camera.position).normalize());
      const hits = ray.intersectObjects(occluders, true);
      blocked = hits.length > 0 && hits[0].distance < camera.position.distanceTo(position) - R;
    }
    const x = (sunV.x * 0.5 + 0.5) * width;
    const y = (-sunV.y * 0.5 + 0.5) * height;
    sunV2.copy(position).addScaledVector(camera.up, R).project(camera);
    const rpx = Math.max(22, Math.abs(sunV2.y - sunV.y) * 0.5 * height * 1.25);
    return { visible: onScreen && !blocked, x, y, size: rpx * 2 };
  };

  return { g, mesh, corona, flares, logoG, spinL, position, R, update, screenState };
};
