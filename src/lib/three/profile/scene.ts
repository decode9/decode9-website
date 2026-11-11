import * as THREE from 'three';
import type { BodyConfig, ScreenRect, SunScreenState, ViewportSize, WorldConfig } from '@/interfaces';
import { computeAnchors, type CameraAnchor } from './anchors';
import { createAverno, createMystery, type AvernoHandle, type MysteryHandle } from './bodies';
import { createBridges, type BridgesHandle } from './bridges';
import { disposeObject } from './dispose';
import { createPrimitives, type Primitives } from './primitives';
import { createGalaxy, createStarfield } from './sky';
import { createMoon, createSun, type MoonHandle, type SunHandle } from './sunMoon';
import { buildWorld, type SceneBody, type WorldHandle } from './world';

export interface ProfileSceneDeps {
  scene: THREE.Scene;
  worlds: WorldConfig[];
  mystery: BodyConfig;
  averno: BodyConfig;
  sun: BodyConfig;
  sunLogoUrl: string;
  /** prefers-reduced-motion: worlds start terraformed and nothing idles. */
  reduce: boolean;
  /** Randomness of stars, galaxy, flares and embers (props use their own seeded generator). */
  random?: () => number;
}

export interface ProfileSceneFrame {
  /** Seconds since the last frame (the original caps it at 0.05). */
  dt: number;
  /** Clock in seconds. */
  t: number;
  /** Index of the body being dragged (its idle spin pauses), or -1. */
  draggingIndex?: number;
}

export interface ProfileScene {
  /** Parent of everything built here; add station/walkie meshes to it so `dispose()` frees them too. */
  root: THREE.Group;
  worlds: WorldHandle[];
  mystery: MysteryHandle;
  averno: AvernoHandle;
  /** Every camera stop in order: worlds…, mystery, averno (`all` of the original). */
  bodies: SceneBody[];
  /** Number of terraformable worlds (NW); `bodies[worldCount]` is the mystery. */
  worldCount: number;
  /** Index of the last stop (LAST). */
  lastIndex: number;
  bridges: BridgesHandle;
  sun: SunHandle;
  moon: MoonHandle;
  galaxy: THREE.Points;
  stars: THREE.Points;
  /** Shared `box`/`mat` and the LED/rotor/steam registry, for the station and walkie (phase 4c). */
  primitives: Primitives;
  /** Last computed camera stops. */
  readonly anchors: CameraAnchor[];
  /** Recomputes the camera stops (call on resize, after the camera aspect changed). */
  computeAnchors: (aspect: number, viewportHeight: number) => CameraAnchor[];
  /** Advances every idle animation and applies each world's current `p`. */
  update: (frame: ProfileSceneFrame) => void;
  /** Drag gesture on the current body (dx in CSS px). */
  dragSpin: (index: number, dx: number) => void;
  /** Restarts a world's terraform ("replay"). */
  resetWorld: (index: number) => void;
  resetAll: () => void;
  /** Places the moon behind the About button. Call after `camera.updateMatrixWorld()`. */
  placeMoon: (rect: ScreenRect, viewport: ViewportSize, camera: THREE.PerspectiveCamera) => void;
  /** Sun link placement; still combine with the walkie state (`wk.mode === 'dock'`). */
  sunScreenState: (camera: THREE.PerspectiveCamera, viewport: ViewportSize) => SunScreenState;
  /** Removes everything this module added and frees GPU resources. */
  dispose: () => void;
}

/** Builds the galaxy, sun, moon and the six stops of the profile (L1321–1735). */
export const createProfileScene = (deps: ProfileSceneDeps): ProfileScene => {
  const { scene, reduce, random = Math.random } = deps;
  const root = new THREE.Group();
  root.name = 'profile-scene';
  scene.add(root);

  const sunPos = new THREE.Vector3().fromArray(deps.sun.pos);
  const stars = createStarfield(random);
  const galaxy = createGalaxy(sunPos, random);
  const moon = createMoon();
  const sun = createSun({ position: sunPos, R: deps.sun.R, logoUrl: deps.sunLogoUrl, random });
  root.add(stars, galaxy, moon.g, sun.g, sun.logoG);

  const primitives = createPrimitives();
  const worlds = deps.worlds.map((cfg, wi) => buildWorld(cfg, wi, { primitives, reduce }));
  const mystery = createMystery(deps.mystery);
  const averno = createAverno(deps.averno, random);
  const bodies: SceneBody[] = [...worlds, mystery, averno];
  root.add(...bodies.map((b) => b.group));
  const worldCount = worlds.length;
  const bridges = createBridges(bodies, worldCount, reduce);
  root.add(bridges.root);

  let anchors: CameraAnchor[] = [];
  const done = (i: number) => worlds[i].p >= 1;
  const { leds, rotors, steam } = primitives.registry;
  const occluders = bodies.map((b) => b.group);

  const update: ProfileScene['update'] = ({ dt, t: tt, draggingIndex = -1 }) => {
    worlds.forEach((w) => w.update(dt, tt));
    if (!reduce) {
      bodies.forEach((w, i) => {
        if (i === draggingIndex) return;
        w.spin *= 0.94;
        w.spinner.rotation.y += 0.07 * dt + w.spin;
      });
      mystery.update(tt);
      averno.update(tt);
    }
    bridges.update(dt, tt, done);
    leds.forEach((l, i) => {
      l.visible = reduce || Math.sin(tt * 3 + i * 1.7) > -0.4;
    });
    if (!reduce) {
      rotors.forEach((r) => {
        r.rotation.z += dt * (r.userData.speed as number);
      });
      steam.forEach((s) => {
        const ph = (tt * 0.45 + s.k) % 1;
        s.m.position.y = 0.24 + ph * 0.3;
        s.m.material.opacity = 0.6 * (1 - ph);
        s.m.scale.setScalar(0.6 + ph * 0.9);
      });
      galaxy.rotation.y += dt * 0.01;
      moon.update(dt, tt);
    }
    sun.update(dt, tt, reduce);
  };

  const resetWorld = (i: number) => {
    const w = worlds[i];
    if (!w) return;
    w.p = reduce ? 1 : 0;
    w.advanced = false;
  };

  return {
    root,
    worlds,
    mystery,
    averno,
    bodies,
    worldCount,
    lastIndex: bodies.length - 1,
    bridges,
    sun,
    moon,
    galaxy,
    stars,
    primitives,
    get anchors() {
      return anchors;
    },
    computeAnchors: (aspect, viewportHeight) => {
      anchors = computeAnchors(bodies, worldCount, aspect, viewportHeight);
      return anchors;
    },
    update,
    dragSpin: (index, dx) => {
      const w = bodies[index];
      if (!w) return;
      w.spinner.rotation.y += dx * 0.008;
      w.spin = dx * 0.008;
    },
    resetWorld,
    resetAll: () => worlds.forEach((_, i) => resetWorld(i)),
    placeMoon: (rect, viewport, camera) => moon.place(rect, viewport, camera),
    sunScreenState: (camera, viewport) => sun.screenState(camera, viewport, occluders),
    dispose: () => {
      disposeObject(root);
      primitives.dispose();
      leds.length = 0;
      rotors.length = 0;
      steam.length = 0;
    },
  };
};
