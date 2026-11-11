'use client';

import { useEffect, useState } from 'react';

/** Phone heuristics of the original d9EsMovil(): coarse pointer and narrow screen, or phone UA with touch. */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia('(max-width: 760px)').matches;
    const ua = /Android|iPhone|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
    return (coarse && narrow) || (ua && coarse);
  } catch {
    return false;
  }
};

/** `?escritorio=1` forces the desktop version on a phone. */
export const hasDesktopOverride = (search: string): boolean => /[?&]escritorio=1/.test(search);

/** True when the visitor is on a phone and did not ask for the desktop version. */
export const shouldUseMobile = (): boolean =>
  typeof window !== 'undefined' && isMobileDevice() && !hasDesktopOverride(window.location.search);

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface DeviceInfo {
  /** Phone (see isMobileDevice). */
  isMobile: boolean;
  /** `?escritorio=1` present. */
  forceDesktop: boolean;
  /** prefers-reduced-motion. */
  reduceMotion: boolean;
  /** Alias of reduceMotion (used by the entry page). */
  reducedMotion: boolean;
  /** Coarse pointer or touch support. */
  isTouch: boolean;
  /** Primary pointer can hover. */
  canHover: boolean;
}

const EMPTY: DeviceInfo = {
  isMobile: false,
  forceDesktop: false,
  reduceMotion: false,
  reducedMotion: false,
  isTouch: false,
  canHover: false,
};

const media = (query: string): boolean => {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
};

/** Device facts read once on the client (all false during SSR). */
const useDevice = (): DeviceInfo => {
  const [info, setInfo] = useState<DeviceInfo>(EMPTY);
  useEffect(() => {
    const reduce = prefersReducedMotion();
    setInfo({
      isMobile: isMobileDevice(),
      forceDesktop: hasDesktopOverride(window.location.search),
      reduceMotion: reduce,
      reducedMotion: reduce,
      isTouch: media('(pointer: coarse)') || 'ontouchstart' in window,
      canHover: media('(hover: hover)'),
    });
  }, []);
  return info;
};

export default useDevice;
