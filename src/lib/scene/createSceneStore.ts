import type { SceneSnapshot, SceneStore } from '@/interfaces/scene';

const sameSnapshot = (a: SceneSnapshot, b: SceneSnapshot): boolean =>
  (Object.keys(a) as (keyof SceneSnapshot)[]).every((key) => a[key] === b[key]);

/**
 * The desired state of the WebGL stage. React writes to it; the lazily loaded
 * three.js director subscribes when (and if) it mounts, so neither side has to
 * wait for the other.
 */
const createSceneStore = (initial: SceneSnapshot): SceneStore => {
  let snapshot = initial;
  const listeners = new Set<(next: SceneSnapshot, previous: SceneSnapshot) => void>();

  return {
    get: () => snapshot,
    set: (patch) => {
      const next = { ...snapshot, ...patch };
      if (sameSnapshot(next, snapshot)) return;
      const previous = snapshot;
      snapshot = next;
      listeners.forEach((listener) => listener(next, previous));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export default createSceneStore;
