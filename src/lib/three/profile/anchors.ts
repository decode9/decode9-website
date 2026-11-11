import * as THREE from 'three';

/** Camera stop for one body (computeAnchors of the original, L2229–2245). */
export interface CameraAnchor {
  /** Where Jorge's station stands (north pole). */
  jorge: THREE.Vector3;
  look: THREE.Vector3;
  cam: THREE.Vector3;
  /** Station yaw at the stop. */
  yaw: number;
}

export interface AnchorBody {
  group: { position: THREE.Vector3 };
  R: number;
  top: number;
}

const UP = new THREE.Vector3(0, 1, 0);

/**
 * @param bodies all stops in order: worlds, then mystery (index `worldCount`), then averno
 * @param aspect camera aspect (width / height)
 * @param viewportHeight CSS px; short screens (< 740) back the camera off in portrait
 */
export const computeAnchors = (bodies: AnchorBody[], worldCount: number, aspect: number, viewportHeight: number): CameraAnchor[] => {
  const k = aspect < 1 ? Math.min(3, 1.3 / aspect + (viewportHeight < 740 ? 0.35 : 0)) : 1.14;
  const lat = aspect > 1.25 ? 1.3 : 0;
  return bodies.map((w, i) => {
    const myst = i === worldCount;
    const hell = i === worldCount + 1;
    const view = myst ? -1 : 1;
    const zoom = (myst ? 1.25 : hell ? 1.2 : 1) * (aspect < 1 && (myst || hell) ? 1.25 : 1);
    const lookY = myst ? 1.0 : 0.55;
    const base = w.R / 2;
    const s = base * zoom;
    const P = w.group.position;
    const vd = new THREE.Vector3(0, 0, view);
    const right = UP.clone().cross(vd);
    return {
      jorge: P.clone().add(new THREE.Vector3(0, w.top - 0.01, 0)),
      look: P.clone()
        .addScaledVector(right, -lat * s)
        .add(new THREE.Vector3(0, lookY * base - (aspect < 1 ? 1.05 * s : -0.2 * s), 0)),
      cam: P.clone()
        .addScaledVector(right, -lat * s)
        .addScaledVector(UP, 3.0 * k * s)
        .addScaledVector(vd, 8.4 * k * s),
      yaw: myst ? 0.9 + Math.PI : hell ? 0.5 : 0.9,
    };
  });
};
