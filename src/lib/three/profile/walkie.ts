import * as THREE from 'three';
import type { StageModuleFactory, WalkieMode, WalkieModule } from './modules';

/** Dock on the desk (station local space) and its rotation. */
const DOCK = new THREE.Vector3(-0.23, 0.39, -0.02);
const DOCK_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -1.25, 0));

/** Seconds of the flight: out (2 s from the stratosphere, 1 s from the desk) and back. */
export const walkieDuration = (mode: WalkieMode, strato: boolean): number => (mode === 'out' ? (strato ? 2.0 : 1.0) : 0.75);

/**
 * Walkie rig (L2167–2202 and pose L2453–2476) without meshes: state machine, pose of `group`
 * between the desk and the foreground, and the raycast hit test. 4c-2 adds the walkie meshes to
 * `group` (and its LED to primitives.registry.leds). `onShown` fires when the flight ends.
 */
export const createWalkieRig =
  (onShown: () => void): StageModuleFactory<WalkieModule> =>
  ({ camera, station, profile }) => {
    const group = new THREE.Group();
    group.name = 'walkie';
    profile.root.add(group);
    let mode: WalkieMode = 'dock';
    let t = 0;
    let strato = false;
    const wP0 = new THREE.Vector3();
    const wP1 = new THREE.Vector3();
    const wC = new THREE.Vector3();
    const wQ0 = new THREE.Quaternion();
    const wQ1 = new THREE.Quaternion();
    const wUp = new THREE.Vector3();
    const FG = new THREE.Vector3();
    const qTmp = new THREE.Quaternion();
    const eTmp = new THREE.Euler();
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const center = new THREE.Vector3();
    const view = { width: 1, height: 1 };

    const open = (s: boolean) => {
      if (mode === 'out' || mode === 'open') return;
      strato = s;
      mode = 'out';
      if (t < 0.001) t = 0;
    };
    const close = () => {
      if (mode === 'dock' || mode === 'back') return;
      mode = 'back';
    };

    return {
      group,
      get mode() {
        return mode;
      },
      open,
      close,
      hits: (x, y) => {
        ndc.set((x / view.width) * 2 - 1, -(y / view.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        group.getWorldPosition(center);
        const d = ray.ray.distanceToPoint(center);
        return d < (mode === 'dock' ? 0.2 : 0.14) || ray.intersectObject(group, true).length > 0;
      },
      update: ({ dt, t: tt, fl, spS, reduce, viewport }) => {
        view.width = viewport.width;
        view.height = viewport.height;
        const dur = walkieDuration(mode, strato);
        if (mode === 'out') {
          t = Math.min(1, t + dt / dur);
          if (reduce) t = 1;
          if (t >= 1) {
            mode = 'open';
            onShown();
          }
        } else if (mode === 'back') {
          t = Math.max(0, t - dt / dur);
          if (t <= 0) mode = 'dock';
        }
        // pose on the desk (floats a little without gravity)
        wP0.copy(DOCK);
        wP0.y += fl * (0.12 + Math.sin(tt * 1.9) * 0.03);
        wP0.x += fl * 0.05;
        station.localToWorld(wP0);
        wQ0.copy(station.quaternion).multiply(DOCK_Q);
        if (fl > 0) wQ0.multiply(qTmp.setFromEuler(eTmp.set(fl * Math.sin(tt * 1.3) * 0.6, fl * tt * 0.8, fl * 0.3)));
        // pose in the foreground, in front of the camera
        const narrow = viewport.width <= 720;
        FG.set(narrow ? 0 : 0.3, narrow ? 0.42 : -0.02, narrow ? -2.3 : -1.45);
        wP1.copy(FG).applyMatrix4(camera.matrixWorld);
        wQ1.copy(camera.quaternion).multiply(qTmp.setFromEuler(eTmp.set(Math.sin(tt * 1.1) * 0.08, -0.35 + Math.sin(tt * 0.7) * 0.12, Math.sin(tt * 0.9) * 0.05)));
        const we = t * t * (3 - 2 * t);
        if (we <= 0) {
          group.position.copy(wP0);
          group.quaternion.copy(wQ0);
          group.scale.setScalar(1.3);
          return;
        }
        const body = profile.bodies[Math.min(profile.lastIndex, Math.round(spS))];
        wUp.copy(station.position).sub(body.group.position).normalize();
        wC.copy(wP0).lerp(wP1, 0.5).addScaledVector(wUp, strato && mode !== 'back' ? 7 : 1.1);
        const u = 1 - we;
        group.position.set(0, 0, 0).addScaledVector(wP0, u * u).addScaledVector(wC, 2 * u * we).addScaledVector(wP1, we * we);
        group.quaternion.copy(wQ0).slerp(wQ1, we);
        if (we < 1) group.rotateY(Math.sin(Math.PI * we) * (strato ? 6.3 : 3.1));
        group.scale.setScalar(1.3 + we * 0.15);
      },
      // the group lives under profile.root: profile.dispose() frees it with its meshes
    };
  };
