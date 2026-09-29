import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector3 } from 'three';
import { gsap } from '@/lib/motion/gsap';
import { createRandom, lerp, staggeredProgress } from '@/utils/math';
import { particleFragmentShader, particleVertexShader } from '../shaders/particles';

export interface ParticleField {
  object: Points;
  morphTo: (target: Float32Array, duration: number) => void;
  /** Drives the morph towards `target` by hand (0–1), e.g. with load progress. */
  scrubTo: (target: Float32Array, progress: number) => void;
  /** A shock of turbulence: sparks flying off the shape. */
  burst: () => void;
  setAccent: (hex: string, duration: number) => void;
  setIntensity: (value: number, duration: number) => void;
  setThinking: (thinking: boolean) => void;
  /** World position to highlight, or null. */
  setFocus: (position: Vector3 | null) => void;
  setPointer: (position: Vector3, active: boolean) => void;
  /** Extra turbulence from scroll velocity, 0–1. */
  setAgitation: (value: number) => void;
  update: (time: number) => void;
  dispose: () => void;
}

interface ParticleFieldOptions {
  initial: Float32Array;
  pixelRatio: number;
  size?: number;
}

const SPREAD = 0.35;
/** Additive particles pile up: normalise brightness to this count so every tier reads the same. */
const REFERENCE_COUNT = 9000;
const BASE_COLOR = '#c9ccd6';

const createParticleField = ({ initial, pixelRatio, size = 30 }: ParticleFieldOptions): ParticleField => {
  const count = initial.length / 3;
  const random = createRandom(4);
  const seeds = Float32Array.from({ length: count }, () => random());
  const scales = Float32Array.from({ length: count }, () => 0.45 + Math.pow(random(), 3) * 1.4);

  const from = new Float32Array(initial);
  const to = new Float32Array(initial);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(from, 3));
  geometry.setAttribute('aTo', new BufferAttribute(to, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1));

  const uniforms = {
    uProgress: { value: 1 },
    uSpread: { value: SPREAD },
    uTime: { value: 0 },
    uTurbulence: { value: 0 },
    uSize: { value: size },
    uPixelRatio: { value: pixelRatio },
    uThinking: { value: 0 },
    uIntensity: { value: 0 },
    uDensity: { value: Math.min(1, Math.sqrt(REFERENCE_COUNT / count)) },
    uFocus: { value: new Vector3(0, 0, 100) },
    uFocusStrength: { value: 0 },
    uPointer: { value: new Vector3(0, 0, 100) },
    uPointerStrength: { value: 0 },
    uBase: { value: new Color(BASE_COLOR) },
    uAccent: { value: new Color('#E5121B') },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const object = new Points(geometry, material);
  object.frustumCulled = false;

  const turbulence = { value: 0 };
  const agitation = { value: 0 };
  let turbulenceTimeline: ReturnType<typeof gsap.timeline> | null = null;

  /** Freezes the current in-flight positions into `from`, so a new morph starts exactly where particles are. */
  const rebase = () => {
    const progress = uniforms.uProgress.value;
    if (progress >= 1) {
      from.set(to);
      return;
    }
    Array.from({ length: count }).forEach((_, index) => {
      const eased = staggeredProgress(progress, seeds[index]!, SPREAD);
      const offset = index * 3;
      from[offset] = lerp(from[offset]!, to[offset]!, eased);
      from[offset + 1] = lerp(from[offset + 1]!, to[offset + 1]!, eased);
      from[offset + 2] = lerp(from[offset + 2]!, to[offset + 2]!, eased);
    });
  };

  let currentTarget: Float32Array | null = null;

  const retarget = (target: Float32Array) => {
    gsap.killTweensOf(uniforms.uProgress);
    rebase();
    currentTarget = target;
    to.set(target.subarray(0, to.length));
    (geometry.attributes.position as BufferAttribute).needsUpdate = true;
    (geometry.attributes.aTo as BufferAttribute).needsUpdate = true;
    uniforms.uProgress.value = 0;
  };

  const morphTo = (target: Float32Array, duration: number) => {
    retarget(target);
    gsap.to(uniforms.uProgress, { value: 1, duration, ease: 'none' });

    turbulenceTimeline?.kill();
    turbulenceTimeline = gsap
      .timeline()
      .to(turbulence, { value: 1.1, duration: duration * 0.3, ease: 'power2.out' })
      .to(turbulence, { value: 0, duration: duration * 0.7, ease: 'power2.inOut' });
  };

  const scrubTo = (target: Float32Array, progress: number) => {
    if (target !== currentTarget) retarget(target);
    turbulenceTimeline?.kill();
    gsap.killTweensOf(uniforms.uProgress);
    uniforms.uProgress.value = progress;
    // Loose sparks early on, settling as the mark completes.
    turbulence.value = (1 - progress) * 0.9;
  };

  const burst = () => {
    turbulenceTimeline?.kill();
    turbulenceTimeline = gsap
      .timeline()
      .fromTo(turbulence, { value: 0.55 }, { value: 0, duration: 1.6, ease: 'expo.out' });
  };

  const accentColor = new Color();
  const setAccent = (hex: string, duration: number) => {
    accentColor.set(hex);
    gsap.to(uniforms.uAccent.value, {
      r: accentColor.r,
      g: accentColor.g,
      b: accentColor.b,
      duration,
      ease: 'power2.inOut',
    });
  };

  return {
    object,
    morphTo,
    scrubTo,
    burst,
    setAccent,
    setIntensity: (value, duration) => {
      gsap.to(uniforms.uIntensity, { value, duration, ease: 'power2.inOut', overwrite: true });
    },
    setThinking: (thinking) => {
      gsap.to(uniforms.uThinking, { value: thinking ? 1 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: true });
    },
    setFocus: (position) => {
      if (position) uniforms.uFocus.value.copy(position);
      gsap.to(uniforms.uFocusStrength, { value: position ? 1 : 0, duration: 0.5, ease: 'power2.out', overwrite: true });
    },
    setPointer: (position, active) => {
      uniforms.uPointer.value.lerp(position, 0.18);
      uniforms.uPointerStrength.value = lerp(uniforms.uPointerStrength.value, active ? 1 : 0, 0.06);
    },
    setAgitation: (value) => {
      agitation.value = lerp(agitation.value, value, 0.08);
    },
    update: (time) => {
      uniforms.uTime.value = time;
      uniforms.uTurbulence.value = turbulence.value + agitation.value * 0.35;
    },
    dispose: () => {
      turbulenceTimeline?.kill();
      gsap.killTweensOf([
        uniforms.uProgress,
        uniforms.uIntensity,
        uniforms.uThinking,
        uniforms.uFocusStrength,
        uniforms.uAccent.value,
      ]);
      geometry.dispose();
      material.dispose();
    },
  };
};

export default createParticleField;
