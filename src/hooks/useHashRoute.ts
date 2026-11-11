'use client';

import { useCallback } from 'react';

/** Reads the current `#id` if it is one of `valid`, else `fallback`. */
export const readHashRoute = <T extends string>(valid: readonly T[], fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const hash = window.location.hash.replace('#', '') as T;
  return valid.includes(hash) ? hash : fallback;
};

/**
 * Hash routing without history entries (original go(): replaceState).
 * The `home` id is written as a clean URL (path + search, no hash).
 */
const useHashRoute = <T extends string>(valid: readonly T[], home: T) => {
  const read = useCallback(() => readHashRoute(valid, home), [valid, home]);
  const write = useCallback(
    (id: T) => {
      try {
        const { pathname, search } = window.location;
        window.history.replaceState(null, '', id === home ? pathname + search : `#${id}`);
      } catch {
        // Sandboxed iframes can refuse replaceState; routing still works in memory.
      }
    },
    [home],
  );
  return { read, write };
};

export default useHashRoute;
