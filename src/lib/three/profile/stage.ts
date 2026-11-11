import * as THREE from 'three';

/**
 * Renderer, camera and lights of the profile (perfil/index.html L1309–1319).
 *
 * Porting notes, three r128 (three.min.js of the original) → r186:
 * - Colour management: r128 used hex colours as-is and wrote linear output. To keep the exact
 *   look we disable `ColorManagement` while the stage lives and render to `LinearSRGBColorSpace`
 *   (no sRGB encode). Textures keep the default `NoColorSpace`, as in r128. The previous flag is
 *   restored on `dispose()`.
 * - Lighting: r155 removed legacy lights (`useLegacyLights`). Legacy mode multiplied irradiance
 *   by π, so directional / hemisphere / ambient intensities are scaled by π (`legacyIntensity`).
 *   Point lights also change falloff (legacy linear `1 - d/cutoff` with decay 1 vs physical
 *   `1/d^decay · window`); `createLegacyPointLight` uses decay 1 and ×π, which stays within a
 *   few % of the old falloff at the distances used in the scene (1–3 units).
 */

export const legacyIntensity = (intensity: number): number => intensity * Math.PI;

/** Point light that approximates an r128 `PointLight(color, intensity, distance)` (decay 1). */
export const createLegacyPointLight = (color: THREE.ColorRepresentation, intensity: number, distance: number): THREE.PointLight =>
  new THREE.PointLight(color, legacyIntensity(intensity), distance, 1);

export interface ProfileStageOptions {
  canvas: HTMLCanvasElement;
  /** Device pixel ratio (capped at 2, like the original). */
  pixelRatio?: number;
  /** Called when the GL context comes back (the original reloads the page). */
  onContextRestored?: () => void;
}

export interface ProfileLights {
  hemi: THREE.HemisphereLight;
  sun: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
}

export interface ProfileStage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  lights: ProfileLights;
  /** Resizes the drawing buffer (CSS size untouched) and the camera aspect. */
  resize: (width: number, height: number) => void;
  render: () => void;
  dispose: () => void;
}

export const createProfileStage = ({ canvas, pixelRatio = 1, onContextRestored }: ProfileStageOptions): ProfileStage => {
  const previousColorManagement = THREE.ColorManagement.enabled;
  THREE.ColorManagement.enabled = false;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(pixelRatio || 1, 2));

  const onLost = (e: Event) => e.preventDefault();
  const onRestored = () => onContextRestored?.();
  canvas.addEventListener('webglcontextlost', onLost, false);
  canvas.addEventListener('webglcontextrestored', onRestored, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 700);

  const hemi = new THREE.HemisphereLight(0xc4d0ff, 0x3a2a4a, legacyIntensity(0.75));
  const sun = new THREE.DirectionalLight(0xffdcb0, legacyIntensity(1.05));
  sun.position.set(4, 6, 4);
  const rim = new THREE.DirectionalLight(0x8fb6ff, legacyIntensity(0.45));
  rim.position.set(-5, 2, -4);
  scene.add(hemi, sun, rim);

  const resize = (width: number, height: number) => {
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  };

  const render = () => renderer.render(scene, camera);

  const dispose = () => {
    canvas.removeEventListener('webglcontextlost', onLost, false);
    canvas.removeEventListener('webglcontextrestored', onRestored, false);
    renderer.dispose();
    THREE.ColorManagement.enabled = previousColorManagement;
  };

  return { scene, camera, renderer, lights: { hemi, sun, rim }, resize, render, dispose };
};
