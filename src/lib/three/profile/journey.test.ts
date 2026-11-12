import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import type { CameraAnchor } from './anchors';
import {
  AUTOPILOT_DELAY_MS,
  cameraBetween,
  floatTowards,
  followScroll,
  scrollToStops,
  segmentAt,
  settledStop,
  stationPose,
  terraformStep,
} from './journey';

const anchor = (x: number, yaw = 0.9): CameraAnchor => ({
  jorge: new THREE.Vector3(x, 1, 0),
  look: new THREE.Vector3(x, 0, 0),
  cam: new THREE.Vector3(x, 3, 8),
  yaw,
});

describe('scroll → stops', () => {
  it('maps one viewport per stop and clamps', () => {
    expect(scrollToStops(0, 900, 6)).toBe(0);
    expect(scrollToStops(1350, 900, 6)).toBeCloseTo(1.5);
    expect(scrollToStops(99999, 900, 6)).toBe(6);
    expect(scrollToStops(-50, 900, 6)).toBe(0);
  });

  it('measures in stop heights, so a snapped stop lands even if the window is taller (mobile, bar hidden)', () => {
    const svh = 640; // one stop (100svh)
    const lvh = 720; // innerHeight with the browser bar hidden
    const sp = scrollToStops(3 * svh, svh, 6);
    expect(sp).toBe(3);
    expect(segmentAt(sp, 6).flying).toBe(false);
    // the old unit (innerHeight) left Jorge hanging two thirds of the way between stops 2 and 3
    expect(segmentAt(scrollToStops(3 * svh, lvh, 6), 6).flying).toBe(true);
  });

  it('follows with inertia and snaps when close', () => {
    const next = followScroll(0, 1, 0.05, false);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(0.2);
    expect(followScroll(0, 1, 0.05, true)).toBe(1);
    expect(followScroll(0.9998, 1, 0.016, false)).toBe(1);
  });

  it('splits the scroll into segment, eased fraction and flight', () => {
    expect(segmentAt(2, 6)).toMatchObject({ a: 2, f: 0, flying: false, current: 2 });
    const mid = segmentAt(2.5, 6);
    expect(mid).toMatchObject({ a: 2, flying: true, current: 3 });
    expect(mid.e).toBeCloseTo(0.5);
    expect(segmentAt(6, 6)).toMatchObject({ a: 5, f: 1, flying: false, current: 6 });
  });

  it('only settles when scroll and camera rest on the same stop', () => {
    expect(settledStop(3, 3.01)).toBe(3);
    expect(settledStop(3, 3.2)).toBe(-1);
    expect(settledStop(3.1, 3.1)).toBe(-1);
  });
});

describe('camera and station', () => {
  it('interpolates the camera between two anchors', () => {
    const cam = new THREE.Vector3();
    const look = new THREE.Vector3();
    cameraBetween(anchor(0), anchor(10), 0.25, cam, look);
    expect(cam.x).toBeCloseTo(2.5);
    expect(look.x).toBeCloseTo(2.5);
    expect(cam.y).toBeCloseTo(3);
  });

  it('stands on the nearest anchor when not flying and orbits in between', () => {
    const o = new THREE.Object3D();
    const A = anchor(0);
    const B = anchor(10, 0.5);
    const bA = { group: { position: new THREE.Vector3(0, 0, 0) }, top: 1 };
    const bB = { group: { position: new THREE.Vector3(10, 0, 0) }, top: 1 };
    const cam = new THREE.Vector3(0, 3, 8);
    const look = new THREE.Vector3();
    stationPose(o, segmentAt(0, 6), A, B, bA, bB, cam, look, 0, true);
    expect(o.position.toArray()).toEqual([0, 1, 0]);
    stationPose(o, segmentAt(0.5, 6), A, B, bA, bB, cam, look, 0, true);
    expect(o.position.x).toBeGreaterThan(2);
    expect(o.position.x).toBeLessThan(8);
    // feet towards the centre of mass: local up points away from it
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(o.quaternion);
    const away = o.position.clone().sub(new THREE.Vector3(5, 0, 0)).normalize();
    expect(up.dot(away)).toBeGreaterThan(0.6);
  });

  it('floats up during the flight and settles back', () => {
    let fl = 0;
    for (let i = 0; i < 60; i++) fl = floatTowards(fl, true, 0.5, 0.05);
    expect(fl).toBeGreaterThan(0.95);
    for (let i = 0; i < 200; i++) fl = floatTowards(fl, false, 0, 0.05);
    expect(fl).toBe(0);
  });
});

describe('terraform autopilot', () => {
  const base = { dt: 1, advanceAt: 0, reduce: false, hold: false, paused: false };

  it('advances the world and pauses at night', () => {
    const w = { p: 0, advanced: false };
    terraformStep(w, { ...base, now: 0 });
    expect(w.p).toBeGreaterThan(0);
    const p = w.p;
    terraformStep(w, { ...base, now: 0, paused: true });
    expect(w.p).toBe(p);
  });

  it('counts down and then flies on once', () => {
    const w = { p: 1, advanced: false };
    const s1 = terraformStep(w, { ...base, now: 1000 });
    expect(s1).toMatchObject({ advanceAt: 1000 + AUTOPILOT_DELAY_MS, countdown: 3, goNext: false });
    const s2 = terraformStep(w, { ...base, now: 1000 + AUTOPILOT_DELAY_MS, advanceAt: s1.advanceAt });
    expect(s2.goNext).toBe(true);
    expect(w.advanced).toBe(true);
    expect(terraformStep(w, { ...base, now: 9999 }).goNext).toBe(false);
  });

  it('waits while a panel is open and never auto-flies with reduced motion', () => {
    expect(terraformStep({ p: 1, advanced: false }, { ...base, now: 0, hold: true })).toMatchObject({ advanceAt: 0, countdown: 0 });
    expect(terraformStep({ p: 1, advanced: false }, { ...base, now: 0, reduce: true }).countdown).toBe(0);
  });
});
