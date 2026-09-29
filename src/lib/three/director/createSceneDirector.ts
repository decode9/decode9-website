import { type Group, MathUtils, Vector3 } from 'three';
import type { CameraPoseId, SceneSnapshot, SceneStore, ShapeId } from '@/interfaces/scene';
import { cameraPoses } from '@/data/chapters';
import { gsap } from '@/lib/motion/gsap';
import { duration, ease } from '@/lib/motion/tokens';
import type { Isotype } from '../entities/createIsotype';
import type { ParticleField } from '../entities/createParticleField';
import { constellationNode } from '../shapes/providers';
import type { ShapeRegistry } from '../shapes/registry';
import { BLOOM_BASE } from '../stage/createComposer';
import type { Stage } from '../stage/createStage';

export interface SceneDirector {
  /** Re-applies the current state (e.g. after a shape became available). */
  refresh: () => void;
  update: (time: number, delta: number) => void;
  dispose: () => void;
}

interface DirectorOptions {
  stage: Stage;
  subject: Group;
  particles: ParticleField;
  isotype: Isotype;
  shapes: ShapeRegistry;
  store: SceneStore;
}

/** Idle spin per shape (rad/s). Shapes not listed turn back to face the camera. */
const SPIN: Partial<Record<ShapeId, number>> = {
  helix: 0.22,
  constellation: 0.05,
  sphere: 0.12,
  scatter: 0.03,
};

const WIDE_ASPECT = 1.15;

/**
 * Turns the declarative scene state into choreography: particle morphs,
 * camera moves, accent colour, the solid mark's reveal and focus highlights.
 */
const createSceneDirector = ({ stage, subject, particles, isotype, shapes, store }: DirectorOptions): SceneDirector => {
  const lookTarget = new Vector3();
  const focusWorld = new Vector3();
  let appliedShape: ShapeId | null = null;
  let current = store.get();
  let lastAspect = 0;

  const subjectOffset = (poseId: CameraPoseId) => {
    const wide = stage.aspect() > WIDE_ASPECT;
    return { x: wide ? cameraPoses[poseId].shiftX : 0, y: wide ? 0 : 1.1 };
  };

  const moveCamera = (poseId: CameraPoseId, seconds: number) => {
    const pose = cameraPoses[poseId];
    const [px, py, pz] = pose.position;
    const [tx, ty, tz] = pose.target;
    const wide = stage.aspect() > WIDE_ASPECT;
    gsap.to(stage.camera.position, {
      x: px,
      y: py,
      z: wide ? pz : pz + 3,
      duration: seconds,
      ease: ease.camera,
      overwrite: true,
    });
    gsap.to(lookTarget, { x: tx, y: ty, z: tz, duration: seconds, ease: ease.camera, overwrite: true });
    gsap.to(subject.position, { ...subjectOffset(poseId), duration: seconds, ease: ease.camera, overwrite: true });
  };

  /** Boot: the mark assembles centre-stage with the load progress, then materialises. */
  const applyLoading = (next: SceneSnapshot, previous: SceneSnapshot | null) => {
    const progress = next.loading ?? 1;
    const target = shapes.get('isotype');
    if (target) {
      particles.scrubTo(target, progress);
      appliedShape = 'isotype';
    }
    if (previous === null || previous.loading === null) {
      moveCamera('loader', 0.01);
      particles.setAccent(next.accent, 0.01);
      particles.setIntensity(1, 0.8);
    }
    const completed = progress >= 1 && (previous?.loading ?? 0) < 1;
    if (completed) {
      particles.burst();
      stage.composer.setBloom(BLOOM_BASE * 1.6);
      gsap.delayedCall(0.9, () => stage.composer.setBloom(BLOOM_BASE));
      isotype.setReveal(1, 1.1, 0.15);
      particles.setIntensity(0.22, 1.2);
    }
  };

  const apply = (next: SceneSnapshot, previous: SceneSnapshot | null) => {
    if (next.loading !== null) {
      applyLoading(next, previous);
      return;
    }
    const first = previous === null;
    // Leaving the loader: glide from centre-stage to the chapter's framing.
    const settling = previous !== null && previous.loading !== null;
    if (next.shape !== appliedShape) {
      const target = shapes.get(next.shape);
      if (target) {
        particles.morphTo(target, first ? duration.morph * 1.2 : duration.morph);
        appliedShape = next.shape;
      }
    }
    if (first || settling || next.camera !== previous.camera) {
      moveCamera(next.camera, first ? 0.01 : settling ? 1.6 : duration.camera);
    }
    if (first || next.accent !== previous.accent) particles.setAccent(next.accent, first ? 0.01 : 1.2);
    if (first || settling || next.solid !== previous.solid) {
      const appearing = next.solid > (settling ? 1 : (previous?.solid ?? 0));
      isotype.setReveal(next.solid, appearing ? 1.8 : 0.9, appearing ? duration.morph * 0.55 : 0);
    }
    if (first || settling || next.intensity !== previous.intensity || next.solid !== previous.solid) {
      // Over the solid mark the particles only shimmer; elsewhere they are the shape.
      particles.setIntensity(next.intensity * (1 - next.solid * 0.85), 1.4);
    }
    if (first || next.thinking !== previous.thinking) {
      particles.setThinking(next.thinking);
      stage.composer.setBloom(next.thinking ? BLOOM_BASE * 1.4 : BLOOM_BASE);
    }
  };

  const unsubscribe = store.subscribe((next, previous) => {
    current = next;
    apply(next, previous);
  });
  apply(current, null);

  return {
    refresh: () => apply(current, { ...current, shape: appliedShape ?? current.shape }),
    update: (_time, delta) => {
      const aspect = stage.aspect();
      if (Math.abs(aspect - lastAspect) > 0.01) {
        lastAspect = aspect;
        gsap.to(subject.position, {
          // While booting the mark stays centre-stage whatever the chapter's framing.
          ...subjectOffset(current.loading === null ? current.camera : 'loader'),
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true,
        });
      }
      stage.camera.lookAt(lookTarget);

      const spin = current.loading === null ? SPIN[current.shape] : undefined;
      if (spin) {
        subject.rotation.y += spin * delta;
      } else {
        const wrapped = MathUtils.euclideanModulo(subject.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
        subject.rotation.y = MathUtils.damp(wrapped, 0, 2.2, delta);
      }

      if (current.focus !== null && current.shape === 'constellation') {
        const [x, y, z] = constellationNode(current.focus);
        particles.setFocus(subject.localToWorld(focusWorld.set(x, y, z)));
      } else {
        particles.setFocus(null);
      }
    },
    dispose: () => {
      unsubscribe();
      gsap.killTweensOf([stage.camera.position, lookTarget, subject.position]);
    },
  };
};

export default createSceneDirector;
