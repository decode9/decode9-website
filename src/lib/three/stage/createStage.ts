import {
  Color,
  FogExp2,
  NoToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { QualitySettings } from '@/interfaces/scene';
import { gsap } from '@/lib/motion/gsap';
import createComposer, { type StageComposer } from './createComposer';

export type FrameCallback = (time: number, delta: number) => void;

export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  composer: StageComposer;
  /** Width / height of the viewport. */
  aspect: () => number;
  onFrame: (callback: FrameCallback) => () => void;
  dispose: () => void;
}

interface StageOptions {
  host: HTMLElement;
  quality: QualitySettings;
  onContextLost: () => void;
}

const INK_950 = 0x0b0c0e;

/** Renderer, camera, environment and the render loop (on gsap.ticker, paused while the tab is hidden). */
const createStage = ({ host, quality, onContextLost }: StageOptions): Stage => {
  const renderer = new WebGLRenderer({
    antialias: quality.tier !== 'low',
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.maxDpr));
  renderer.outputColorSpace = SRGBColorSpace;
  // No tone mapping: ACES in OutputPass crushes the near-black backdrop, and the stage
  // has to sit exactly on the page's ink-950. Render targets are cleared with the colour
  // already encoded for output and OutputPass encodes it again, so the clear colour is
  // pre-compensated to land on #0B0C0E on screen.
  renderer.toneMapping = NoToneMapping;
  const ink = new Color(INK_950);
  renderer.setClearColor(new Color().setRGB(ink.r, ink.g, ink.b, SRGBColorSpace), 1);
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.fog = new FogExp2(INK_950, 0.028);
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;

  const composer = createComposer(renderer, scene, camera, quality);

  const resize = () => {
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    composer.setSize(width, height);
  };
  resize();
  window.addEventListener('resize', resize);

  const callbacks = new Set<FrameCallback>();
  const tick = (time: number, deltaMs: number) => {
    if (document.hidden) return;
    const delta = Math.min(deltaMs / 1000, 0.1);
    callbacks.forEach((callback) => callback(time, delta));
    composer.render();
  };
  gsap.ticker.add(tick);

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

  return {
    renderer,
    scene,
    camera,
    composer,
    aspect: () => camera.aspect,
    onFrame: (callback) => {
      callbacks.add(callback);
      return () => {
        callbacks.delete(callback);
      };
    },
    dispose: () => {
      gsap.ticker.remove(tick);
      callbacks.clear();
      window.removeEventListener('resize', resize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      composer.dispose();
      environment.dispose();
      pmrem.dispose();
      room.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
};

export default createStage;
