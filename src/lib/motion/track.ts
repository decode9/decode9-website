import type { gsap } from 'gsap';

type TrackTween = ReturnType<typeof gsap.to>;

let track: TrackTween | null = null;

/**
 * The horizontal tour's scroll-driven tween (null in the vertical layout).
 * Kept outside React so imperative code (navigation) can read it without
 * re-rendering; React consumers use the ScrollLayout context instead.
 */
export const setTrack = (next: TrackTween | null): void => {
  track = next;
};

export const getTrack = (): TrackTween | null => track;

export type { TrackTween };
