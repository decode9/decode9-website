import * as THREE from 'three';

/** Animated bits registered by the props (blinking LEDs, turbine rotors, geothermal steam). */
export interface PropRegistry {
  leds: THREE.Mesh[];
  rotors: THREE.Group[];
  steam: { m: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>; k: number }[];
}

export interface Primitives {
  /** Shared material per colour: flat Standard, or Basic (unlit) when `basic`. */
  mat: (color: number, basic?: boolean) => THREE.Material;
  /** Adds a box of size w·h·d at (x,y,z) to `parent` and returns it. */
  box: (
    parent: THREE.Object3D,
    w: number,
    h: number,
    d: number,
    color: number,
    x: number,
    y: number,
    z: number,
    basic?: boolean,
  ) => THREE.Mesh;
  registry: PropRegistry;
  /** Disposes the cached materials (geometries are freed by `disposeObject`). */
  dispose: () => void;
}

/** `mat` / `box` helpers of the original (L1416–1421), with their material cache. */
export const createPrimitives = (): Primitives => {
  const cache = new Map<string, THREE.Material>();

  const mat: Primitives['mat'] = (color, basic = false) => {
    const key = `${color}${basic ? 'b' : ''}`;
    let m = cache.get(key);
    if (!m) {
      m = basic
        ? new THREE.MeshBasicMaterial({ color })
        : new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true });
      cache.set(key, m);
    }
    return m;
  };

  const box: Primitives['box'] = (parent, w, h, d, color, x, y, z, basic = false) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, basic));
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  const dispose = () => {
    cache.forEach((m) => m.dispose());
    cache.clear();
  };

  return { mat, box, registry: { leds: [], rotors: [], steam: [] }, dispose };
};
