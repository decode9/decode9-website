import * as THREE from 'three';

/** Background star shell (L1322–1330). */
export const createStarfield = (random: () => number = Math.random): THREE.Points => {
  const n = 1400;
  const pos = new Float32Array(n * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.set(random() - 0.5, random() - 0.5, random() - 0.5)
      .normalize()
      .multiplyScalar(110 + random() * 60);
    pos.set([v.x, v.y + 8, v.z - 20], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xdfe4ff, size: 0.32, transparent: true, opacity: 0.75 }));
};

/**
 * Three-armed spiral galaxy (L1332–1346), centred on the sun and scaled ×1.6 there (L1349).
 */
export const createGalaxy = (center: THREE.Vector3, random: () => number = Math.random): THREE.Points => {
  const n = 3200;
  const pos = new Float32Array(n * 3);
  const cl = new Float32Array(n * 3);
  const cA = new THREE.Color(0xffc6e8);
  const cB = new THREE.Color(0x8f9bff);
  const cC = new THREE.Color(0xfff1d6);
  for (let i = 0; i < n; i++) {
    const arm = i % 3;
    const r = Math.pow(random(), 0.7) * 34;
    const a = r * 0.28 + arm * 2.094 + (random() - 0.5) * 0.6;
    pos.set([Math.cos(a) * r, (random() - 0.5) * (4 - r * 0.08), Math.sin(a) * r], i * 3);
    const c = r < 6 ? cC : arm === 1 ? cB : cA;
    cl.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(cl, 3));
  const pts = new THREE.Points(
    g,
    new THREE.PointsMaterial({ size: 0.45, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  pts.position.copy(center);
  pts.rotation.set(-1.05, 0, 0.35);
  pts.scale.setScalar(1.6);
  return pts;
};
