import type { KeyValueStorage } from '@/interfaces/storage';

const localStore = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

/** localStorage that never throws (private mode, blocked storage, SSR). */
export const browserStorage: KeyValueStorage = {
  get: (key) => {
    try {
      return localStore()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStore()?.setItem(key, value);
    } catch {
      // Without storage the experience still works; it just won't remember.
    }
  },
  remove: (key) => {
    try {
      localStore()?.removeItem(key);
    } catch {
      // Same as above.
    }
  },
};

export const createMemoryStorage = (seed: Record<string, string> = {}): KeyValueStorage => {
  const entries = new Map(Object.entries(seed));
  return {
    get: (key) => entries.get(key) ?? null,
    set: (key, value) => {
      entries.set(key, value);
    },
    remove: (key) => {
      entries.delete(key);
    },
  };
};
