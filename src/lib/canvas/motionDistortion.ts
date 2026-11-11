import type { MotionSensor } from '@/interfaces/transmitter';

type PermissionRequester = { requestPermission?: () => Promise<PermissionState | string> };

const requestPermission = async (ctor: unknown): Promise<void> => {
  try {
    const request = (ctor as PermissionRequester | undefined)?.requestPermission;
    if (typeof request === 'function') await request.call(ctor);
  } catch {
    // Denied or not a user gesture: the transmitter works without motion.
  }
};

/**
 * Gyroscope / accelerometer (and mouse movement on desktop) turned into signal distortion.
 * Port of the original `onMotion`, `onOrient`, `enableMotion` and the mouse `pointermove`.
 */
export const createMotionSensor = (target: Window = window): MotionSensor => {
  let shake = 0;
  let tilt = 0;
  let enabled = false;
  let lastAccel: { x: number; y: number; z: number } | null = null;
  let lastOrient: number | null = null;
  let lastPointer: { x: number; y: number } | null = null;

  const kick = (amount: number) => {
    shake = Math.min(1, shake + amount);
  };

  const onMotion = (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity ?? e.acceleration;
    if (!a || a.x == null || a.y == null || a.z == null) return;
    if (lastAccel) {
      const d = Math.abs(a.x - lastAccel.x) + Math.abs(a.y - lastAccel.y) + Math.abs(a.z - lastAccel.z);
      if (d > 1.2) kick(d / 18);
    }
    lastAccel = { x: a.x, y: a.y, z: a.z };
  };

  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta == null) return;
    if (e.gamma != null) {
      const gamma = Math.max(-30, Math.min(30, e.gamma));
      tilt += (gamma - tilt) * 0.15;
    }
    const k = e.beta + (e.gamma ?? 0);
    if (lastOrient != null) {
      const d = Math.abs(k - lastOrient);
      if (d > 4) kick(d / 90);
    }
    lastOrient = k;
  };

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    tilt = (e.clientX / target.innerWidth - 0.5) * 16;
    if (lastPointer) {
      const d = Math.hypot(e.clientX - lastPointer.x, e.clientY - lastPointer.y);
      if (d > 40) kick(d / 900);
    }
    lastPointer = { x: e.clientX, y: e.clientY };
  };

  target.addEventListener('pointermove', onPointer);

  return {
    enable: async () => {
      if (enabled) return;
      enabled = true;
      target.addEventListener('devicemotion', onMotion);
      target.addEventListener('deviceorientation', onOrient);
      await requestPermission(typeof DeviceMotionEvent !== 'undefined' ? DeviceMotionEvent : undefined);
      await requestPermission(typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : undefined);
    },
    get shake() {
      return shake;
    },
    get tilt() {
      return tilt;
    },
    kick,
    decay: () => {
      shake *= 0.93;
    },
    dispose: () => {
      target.removeEventListener('pointermove', onPointer);
      target.removeEventListener('devicemotion', onMotion);
      target.removeEventListener('deviceorientation', onOrient);
    },
  };
};

export default createMotionSensor;
