'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';

/**
 * Gyroscope input for touch devices (generic: any page can steer something by tilting the phone).
 * - Android/most browsers: readings arrive without asking.
 * - iOS: DeviceOrientationEvent.requestPermission() needs a tap; the prompt is shown in "ask" mode
 *   and any touch on the page also requests it once.
 * - No readings after `fallbackMs` (no sensor, no https): horizontal finger position drives the value.
 * The filter (calibration, dead zone…) is injected, so the hook only wires events.
 * The live value is in `stateRef` (read it from a rAF loop; it never re-renders the component).
 */
export interface TiltFilterPort {
  /** True when a reading counts (sensor present, portrait). */
  accepts: (gamma: number | null, beta: number | null, angle: number) => boolean;
  read: (gamma: number | null, beta: number | null, angle: number, now: number) => TiltSample | null;
}

export interface TiltSample {
  value: number;
  fx: number;
  fy: number;
  raw: number;
  base: number;
}

export interface TiltState {
  /** 0–1, null until the first reading. */
  value: number | null;
  fx: number;
  fy: number;
  readings: number;
  /** True after falling back to finger control. */
  finger: boolean;
}

export interface TiltPromptState {
  /** Element rendered (it starts hidden like the original). */
  visible: boolean;
  /** iOS: tap to grant permission. */
  ask: boolean;
  /** Fades in. */
  on: boolean;
}

export interface UseDeviceTiltOptions {
  enabled: boolean;
  filter: TiltFilterPort;
  /** Finger fallback ignores moves while this returns true (e.g. while leaving the page). */
  isPaused?: () => boolean;
  /** ?giro=1 style debug text. */
  debug?: boolean;
  fallbackMs?: number;
  noticeMs?: number;
}

export interface UseDeviceTiltResult {
  stateRef: MutableRefObject<TiltState>;
  prompt: TiltPromptState;
  /** Click handler of the prompt (iOS permission). */
  requestPermission: () => void;
  debugText: string;
}

type PermissionCapable = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

const screenAngle = (): number => {
  const legacy = (window as unknown as { orientation?: number }).orientation;
  return (screen.orientation && screen.orientation.angle) || legacy || 0;
};

const useDeviceTilt = ({
  enabled,
  filter,
  isPaused,
  debug = false,
  fallbackMs = 4000,
  noticeMs = 3200,
}: UseDeviceTiltOptions): UseDeviceTiltResult => {
  const stateRef = useRef<TiltState>({ value: null, fx: 0, fy: 0, readings: 0, finger: false });
  const [prompt, setPrompt] = useState<TiltPromptState>({ visible: false, ask: false, on: false });
  const [debugText, setDebugText] = useState('');
  const listening = useRef(false);
  const seen = useRef(false);
  const pausedRef = useRef(isPaused);
  pausedRef.current = isPaused;

  const onTilt = useCallback(
    (e: DeviceOrientationEvent) => {
      const angle = screenAngle();
      if (!filter.accepts(e.gamma, e.beta, angle)) return;
      const s = stateRef.current;
      s.readings += 1;
      const sample = filter.read(e.gamma, e.beta, angle, performance.now());
      if (!sample) return;
      s.value = sample.value;
      s.fx = sample.fx;
      s.fy = sample.fy;
      if (!seen.current) {
        seen.current = true;
        setPrompt({ visible: true, ask: false, on: true });
        window.setTimeout(() => setPrompt((p) => ({ ...p, on: false })), noticeMs);
      }
      if (debug) {
        setDebugText(
          `giro: ${sample.raw.toFixed(1)}°  base ${sample.base.toFixed(1)}\nvalor ${sample.value.toFixed(2)}  lecturas ${s.readings}\nhttps ${window.isSecureContext}`,
        );
      }
    },
    [debug, filter, noticeMs],
  );

  const listen = useCallback(() => {
    if (listening.current) return;
    listening.current = true;
    window.addEventListener('deviceorientation', onTilt, true);
  }, [onTilt]);

  const requestPermission = useCallback(() => {
    const DOE = window.DeviceOrientationEvent as PermissionCapable | undefined;
    if (DOE && typeof DOE.requestPermission === 'function') {
      DOE.requestPermission()
        .then((r) => {
          if (debug) setDebugText(`permiso: ${r}  https ${window.isSecureContext}`);
          if (r === 'granted') listen();
        })
        .catch((err: unknown) => {
          if (debug) setDebugText(`permiso error: ${String(err)}`);
        });
    } else listen();
  }, [debug, listen]);

  useEffect(() => {
    if (!enabled) return undefined;
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      orientation?.lock?.('portrait').catch(() => {});
    } catch {
      /* not supported */
    }
    listen(); // Android and most: arrives without asking

    const DOE = window.DeviceOrientationEvent as PermissionCapable | undefined;
    let once: (() => void) | null = null;
    if (DOE && typeof DOE.requestPermission === 'function') {
      // iPhone: Apple only allows asking from a tap; the prompt or any touch works
      setPrompt({ visible: true, ask: true, on: true });
      once = () => {
        requestPermission();
        if (once) window.removeEventListener('touchend', once, true);
      };
      window.addEventListener('touchend', once, true);
    }

    const onFinger = (e: TouchEvent) => {
      const s = stateRef.current;
      if (pausedRef.current?.() || s.readings !== 0) return;
      s.value = Math.min(1, Math.max(0, e.touches[0].clientX / window.innerWidth));
    };
    let fingerOn = false;
    const fallback = window.setTimeout(() => {
      if (stateRef.current.readings > 0) return;
      stateRef.current.finger = true;
      fingerOn = true;
      window.addEventListener('touchmove', onFinger, { passive: true });
      if (debug) setDebugText((t) => t || `sin lecturas del giroscopio · https ${window.isSecureContext} · modo dedo`);
    }, fallbackMs);

    return () => {
      window.clearTimeout(fallback);
      if (once) window.removeEventListener('touchend', once, true);
      if (fingerOn) window.removeEventListener('touchmove', onFinger);
      window.removeEventListener('deviceorientation', onTilt, true);
      listening.current = false;
    };
  }, [enabled, debug, fallbackMs, listen, onTilt, requestPermission]);

  return { stateRef, prompt, requestPermission, debugText };
};

export default useDeviceTilt;
