import { useCallback, type RefObject } from 'react';

/** Collects the stop elements so useProfile can scroll to them. */
const useTrack = (stopRefs: RefObject<(HTMLElement | null)[]>) =>
  useCallback(
    (i: number) => (el: HTMLElement | null) => {
      if (stopRefs.current) stopRefs.current[i] = el;
    },
    [stopRefs],
  );

export default useTrack;
