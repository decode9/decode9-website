import type * as THREE from 'three';
import type { StageModuleFactory, WalkieModule } from './modules';
import type { Primitives } from './primitives';
import { createWalkieRig } from './walkie';

const YELLOW = 0xd9a441;
const DARK = 0x2a2e40;

/** Walkie-talkie meshes (perfil/index.html L2155–2166); its antenna LED joins the blinking LEDs. */
export const buildWalkieModel = (group: THREE.Object3D, { box, registry }: Primitives): void => {
  box(group, 0.075, 0.13, 0.04, DARK, 0, 0, 0);
  box(group, 0.079, 0.025, 0.044, YELLOW, 0, -0.045, 0);
  box(group, 0.079, 0.012, 0.044, YELLOW, 0, 0.035, 0);
  box(group, 0.05, 0.03, 0.004, 0x9fd8ff, 0, 0.012, 0.021, true);
  for (let k = 0; k < 3; k++) box(group, 0.05, 0.005, 0.003, 0x4a4f66, 0, -0.012 - k * 0.012, 0.021);
  box(group, 0.014, 0.07, 0.014, 0x1d2133, -0.022, 0.1, 0);
  registry.leds.push(box(group, 0.02, 0.02, 0.02, 0xe0552e, -0.022, 0.14, 0, true));
  box(group, 0.012, 0.03, 0.02, YELLOW, 0.043, 0.02, 0);
  box(group, 0.02, 0.012, 0.012, 0x7fd28e, 0.02, 0.058, 0, true);
};

/** Walkie rig (states, flight, hit test) dressed with its meshes. */
export const createWalkie: StageModuleFactory<WalkieModule> = (ctx) => {
  const rig = createWalkieRig(ctx.ports.onWalkieShown)(ctx);
  buildWalkieModel(rig.group, ctx.profile.primitives);
  return rig;
};
