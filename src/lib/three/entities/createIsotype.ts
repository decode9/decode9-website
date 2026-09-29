import { Box3, Color, type Group, Mesh, MeshPhysicalMaterial, Vector3 } from 'three';
import { gsap } from '@/lib/motion/gsap';
import { applyDissolve } from '../shaders/dissolve';

export interface Isotype {
  /** Attach the loaded GLB (scaled and centred to match the particle shape). */
  setModel: (model: Group) => void;
  setReveal: (value: number, duration: number, delay?: number) => void;
  update: (time: number, pointer: { x: number; y: number }) => void;
  dispose: () => void;
}

const HEIGHT = 3.2;

/**
 * The solid decode9 mark (built in Blender, scripts/blender/build_isotype.py).
 * It materialises through a noise dissolve with a glowing red edge.
 */
const createIsotype = (parent: Group): Isotype => {
  const reveal = { value: 0 };
  const edge: [number, number, number] = [1, 0.08, 0.1];
  const materials = {
    // Tuned for the untone-mapped pipeline (see createStage): deeper base, contrast from reflections.
    red: new MeshPhysicalMaterial({
      color: new Color('#b00a12'),
      metalness: 0.3,
      roughness: 0.34,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.85,
    }),
    chrome: new MeshPhysicalMaterial({
      color: new Color('#9ea3ae'),
      metalness: 1,
      roughness: 0.18,
      envMapIntensity: 1.1,
    }),
  };
  Object.values(materials).forEach((material) =>
    applyDissolve(material, { uReveal: reveal, uEdgeColor: { value: edge } }),
  );

  let model: Group | null = null;

  const setModel = (loaded: Group) => {
    loaded.traverse((child) => {
      if (child instanceof Mesh) {
        const isRed = /red/i.test((child.material as { name?: string }).name ?? '');
        (child.material as { dispose?: () => void }).dispose?.();
        child.material = isRed ? materials.red : materials.chrome;
      }
    });
    const box = new Box3().setFromObject(loaded);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = HEIGHT / Math.max(size.y, 1e-3);
    loaded.scale.setScalar(scale);
    loaded.position.sub(center.multiplyScalar(scale));
    parent.add(loaded);
    model = loaded;
  };

  return {
    setModel,
    setReveal: (value, duration, delay = 0) => {
      gsap.to(reveal, { value, duration, delay, ease: 'power2.inOut', overwrite: true });
    },
    update: (time, pointer) => {
      if (!model) return;
      model.visible = reveal.value > 0.001;
      model.rotation.y = Math.sin(time * 0.35) * 0.18 + pointer.x * 0.25;
      model.rotation.x = pointer.y * -0.12;
    },
    dispose: () => {
      gsap.killTweensOf(reveal);
      model?.traverse((child) => {
        if (child instanceof Mesh) child.geometry.dispose();
      });
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
};

export default createIsotype;
