/** Cascade counter shared by every screen's detail windows (original global `CASC`). */
export interface Cascade {
  /** Advances the counter and returns the new value (original `CASC++`). */
  next: () => number;
  /** Back to zero (original `CASC=0`, done when Origen, Archivo and the Manifesto knowledge tab open). */
  reset: () => void;
}

/** Canal never resets `CASC`, so its post windows continue from whatever the last screen left. */
const createCascade = (): Cascade => {
  let count = 0;
  return {
    next: () => {
      count += 1;
      return count;
    },
    reset: () => {
      count = 0;
    },
  };
};

export default createCascade;
