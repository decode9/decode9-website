import * as THREE from 'three';

const disposeMaterial = (m: THREE.Material, seen: Set<object>) => {
  if (seen.has(m)) return;
  seen.add(m);
  Object.values(m).forEach((value) => {
    if (value instanceof THREE.Texture && !seen.has(value)) {
      seen.add(value);
      value.dispose();
    }
  });
  m.dispose();
};

/** Frees every geometry, material and texture under `root` (each one once) and detaches it. */
export const disposeObject = (root: THREE.Object3D): void => {
  const seen = new Set<object>();
  root.traverse((o) => {
    const node = o as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
    if (node.geometry && !seen.has(node.geometry)) {
      seen.add(node.geometry);
      node.geometry.dispose();
    }
    if (node.material) (Array.isArray(node.material) ? node.material : [node.material]).forEach((m) => disposeMaterial(m, seen));
  });
  root.removeFromParent();
};
