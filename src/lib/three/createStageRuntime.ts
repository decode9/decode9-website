import { Group, Mesh, Plane, PointLight, Raycaster, Vector2, Vector3 } from 'three';
import type { QualitySettings, SceneStore } from '@/interfaces/scene';
import { clamp } from '@/utils/math';
import createSceneDirector from './director/createSceneDirector';
import createIsotype from './entities/createIsotype';
import createParticleField from './entities/createParticleField';
import { loadModel } from './loaders';
import { proceduralShapes } from './shapes/providers';
import createShapeRegistry from './shapes/registry';
import createStage from './stage/createStage';

export interface StageRuntimeOptions {
  host: HTMLElement;
  store: SceneStore;
  quality: QualitySettings;
  /** Resolves public asset paths (base path aware). */
  assetUrl: (path: string) => string;
  onContextLost: () => void;
  /** The first frame is on screen (safe to hide the poster). */
  onFirstFrame: () => void;
  /** The solid mark is loaded (or failed to; the particles carry on either way). */
  onModelSettled: () => void;
}

export interface StageRuntime {
  dispose: () => void;
}

const ISOTYPE_MODEL = '/models/isotype.v1.glb';
const POINTER_IDLE_MS = 1500;

/** Composition root of the WebGL stage. Loaded with a dynamic import so three.js never reaches the first bundle. */
const createStageRuntime = ({
  host,
  store,
  quality,
  assetUrl,
  onContextLost,
  onFirstFrame,
  onModelSettled,
}: StageRuntimeOptions): StageRuntime => {
  let disposed = false;
  const stage = createStage({ host, quality, onContextLost });

  const subject = new Group();
  stage.scene.add(subject);
  const rim = new PointLight('#ff1a24', 30, 12, 2);
  rim.position.set(2.5, 1.5, -2.5);
  const key = new PointLight('#dfe6ff', 14, 20, 2);
  key.position.set(-4, 3, 6);
  stage.scene.add(rim, key);

  const shapes = createShapeRegistry(quality.particles, proceduralShapes);
  const particles = createParticleField({
    initial: shapes.get('scatter') ?? new Float32Array(quality.particles * 3),
    pixelRatio: stage.renderer.getPixelRatio(),
    size: quality.tier === 'low' ? 38 : 30,
  });
  subject.add(particles.object);
  const isotype = createIsotype(subject);
  const director = createSceneDirector({ stage, subject, particles, isotype, shapes, store });

  // Pointer: particles part around the cursor; the mark leans towards it.
  const pointer = { ndc: new Vector2(), world: new Vector3(0, 0, 100), lastMove: 0 };
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const handlePointer = (event: PointerEvent) => {
    pointer.ndc.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer.ndc, stage.camera);
    raycaster.ray.intersectPlane(plane, pointer.world);
    pointer.lastMove = performance.now();
  };
  window.addEventListener('pointermove', handlePointer, { passive: true });

  let lastScroll = window.scrollY;
  let framesDrawn = 0;
  const stopFrame = stage.onFrame((time, delta) => {
    framesDrawn += 1;
    // Frame 2 is the first one guaranteed to be composited with real content.
    if (framesDrawn === 2) onFirstFrame();
    const scroll = window.scrollY;
    const velocity = Math.abs(scroll - lastScroll) / Math.max(delta, 1 / 120);
    lastScroll = scroll;
    particles.setAgitation(clamp(velocity / 4000));
    particles.setPointer(pointer.world, performance.now() - pointer.lastMove < POINTER_IDLE_MS);
    particles.update(time);
    isotype.update(time, pointer.ndc);
    director.update(time, delta);
  });

  loadModel(assetUrl(ISOTYPE_MODEL))
    .then((model) => {
      if (disposed) {
        model.traverse((child) => {
          if (child instanceof Mesh) child.geometry.dispose();
        });
        return;
      }
      isotype.setModel(model);
      director.refresh();
    })
    .catch(() => undefined)
    .finally(() => {
      if (!disposed) onModelSettled();
    });

  return {
    dispose: () => {
      disposed = true;
      window.removeEventListener('pointermove', handlePointer);
      stopFrame();
      director.dispose();
      particles.dispose();
      isotype.dispose();
      stage.dispose();
    },
  };
};

export default createStageRuntime;
