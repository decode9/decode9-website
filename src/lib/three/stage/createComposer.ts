import {
  HalfFloatType,
  type PerspectiveCamera,
  type Scene,
  Vector2,
  type WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { QualitySettings } from '@/interfaces/scene';
import { GradeShader } from '../shaders/grade';

export const BLOOM_BASE = 0.55;

export interface StageComposer {
  render: () => void;
  setSize: (width: number, height: number) => void;
  /** 0 disables bloom (no-op on tiers without it). */
  setBloom: (strength: number) => void;
  dispose: () => void;
}

/** Render → bloom (bright accents only) → grade → output (tone mapping + sRGB). */
const createComposer = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera,
  quality: QualitySettings,
): StageComposer => {
  const size = renderer.getSize(new Vector2());
  const target = new WebGLRenderTarget(size.x, size.y, { type: HalfFloatType });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  // High threshold: only speculars and the hottest sparks glow (there is no tone mapping to tame it).
  const bloom = quality.bloom ? new UnrealBloomPass(new Vector2(size.x, size.y), BLOOM_BASE, 0.4, 0.62) : null;
  if (bloom) composer.addPass(bloom);
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);
  composer.addPass(new OutputPass());

  return {
    render: () => composer.render(),
    setSize: (width, height) => {
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(width, height);
    },
    setBloom: (strength) => {
      if (bloom) bloom.strength = strength;
    },
    dispose: () => {
      bloom?.dispose();
      grade.dispose();
      composer.dispose();
      target.dispose();
    },
  };
};

export default createComposer;
