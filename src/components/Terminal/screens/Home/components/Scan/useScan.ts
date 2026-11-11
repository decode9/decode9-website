'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { drawHomeWave, sputnikGate } from '@/lib/canvas/homeWave';
import type { ScanProps } from './interface';

/** Eye anchor in the 1024×1024 portrait and how far the gaze reaches (fraction of the viewport). */
const EYE = { x: 645 / 1024, y: 400 / 1024, reach: 0.42 };
const IRIS_L = { x: 575 / 1024, y: 399 / 1024 };

/**
 * Home scan (original initHome + sndUI + scan mount/unmount): irises follow the cursor (idle drift after
 * 3.5 s), random blinks, reticle and gaze readout, the wave canvas, and the Sputnik signal on while open.
 */
const useScan = ({ synth, setMuted, reduceMotion }: Pick<ScanProps, 'synth' | 'setMuted' | 'reduceMotion'>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  const reticleRef = useRef<HTMLSpanElement>(null);
  const gazeRef = useRef<HTMLElement>(null);
  const playing = useSyncExternalStore(
    synth.subscribe,
    () => synth.playing,
    () => false,
  );

  /* Sound: on while the scan is open unless muted (original mount → audioOn, unmount → audioOff). */
  useEffect(() => {
    if (!synth.muted) synth.start();
    return () => synth.stop();
  }, [synth]);

  /* Beep phase reference for the wave gate. */
  const startedAt = useRef(0);
  useEffect(() => {
    if (playing) startedAt.current = performance.now();
  }, [playing]);

  useEffect(() => {
    const root = rootRef.current;
    const wave = waveRef.current;
    if (!root || !wave) return undefined;
    const irisL = root.querySelector('#irisL');
    const irisR = root.querySelector('#irisR');
    const lids = Array.from(root.querySelectorAll('[data-lid]'));
    const gaze = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastIn = -1e9;
    let nextBlink = 0;
    let raf = 0;
    const blinkTimers: number[] = [];

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const ex = r.left + r.width * EYE.x;
      const ey = r.top + r.height * EYE.y;
      target.x = Math.max(-1, Math.min(1, (e.clientX - ex) / (window.innerWidth * EYE.reach)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - ey) / (window.innerHeight * EYE.reach)));
      lastIn = performance.now();
    };

    const tick = (t: number) => {
      if (!reduceMotion && t - lastIn > 3500) {
        target.x = Math.sin(t / 2600) * 0.55;
        target.y = Math.sin(t / 1900) * 0.3;
      }
      gaze.x += (target.x - gaze.x) * 0.12;
      gaze.y += (target.y - gaze.y) * 0.12;
      irisL?.setAttribute('transform', `translate(${(gaze.x * 9).toFixed(2)} ${(gaze.y * 4).toFixed(2)})`);
      irisR?.setAttribute('transform', `translate(${(gaze.x * 7).toFixed(2)} ${(gaze.y * 3.4).toFixed(2)})`);
      if (reticleRef.current) {
        reticleRef.current.style.left = `${IRIS_L.x * 100 + gaze.x * 1.2}%`;
        reticleRef.current.style.top = `${IRIS_L.y * 100 + gaze.y * 0.6}%`;
      }
      if (gazeRef.current && Math.random() < 0.2) gazeRef.current.textContent = `${gaze.x.toFixed(2)} / ${gaze.y.toFixed(2)}`;
      if (!reduceMotion && t > nextBlink) {
        lids.forEach((l) => l.setAttribute('opacity', '1'));
        blinkTimers.push(window.setTimeout(() => lids.forEach((l) => l.setAttribute('opacity', '0')), 130));
        nextBlink = t + 2600 + Math.random() * 4200;
      }
      drawHomeWave(wave, t, synth.playing, sputnikGate(performance.now(), startedAt.current, synth.playing));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      blinkTimers.forEach((x) => window.clearTimeout(x));
    };
  }, [reduceMotion, synth]);

  /* Mute button (original .sndbtn click): persists the choice. */
  const toggleSound = () => {
    if (synth.playing) {
      synth.stop();
      setMuted(true);
    } else {
      setMuted(false);
      synth.start();
    }
  };

  return { rootRef, waveRef, reticleRef, gazeRef, playing, toggleSound };
};

export default useScan;
