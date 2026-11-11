import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { buildWalkieModel } from './walkieModel';
import { createPrimitives } from './primitives';
import {
  SCREEN_PALETTE,
  cableSag,
  floatArmTarget,
  pushScreenLine,
  screenInterval,
  typingAmount,
  typingArmTarget,
  type ScreenLine,
} from './workstation';

describe('monitor', () => {
  it('scrolls at most 10 lines and maps random to indent, width and colour', () => {
    let lines: ScreenLine[] = [];
    for (let i = 0; i < 25; i++) lines = pushScreenLine(lines, () => 0.99);
    expect(lines).toHaveLength(10);
    expect(lines[9]).toEqual({ i: 28, w: 30 + 0.99 * 120, c: SCREEN_PALETTE[4] });
    expect(pushScreenLine([], () => 0)[0]).toEqual({ i: 0, w: 30, c: SCREEN_PALETTE[0] });
  });

  it('does not mutate the previous lines', () => {
    const prev: ScreenLine[] = [];
    pushScreenLine(prev, () => 0.5);
    expect(prev).toHaveLength(0);
  });

  it('redraws every 0.16 s while working and 0.5 s idle', () => {
    expect(screenInterval(true)).toBe(0.16);
    expect(screenInterval(false)).toBe(0.5);
  });
});

describe('Jorge', () => {
  it('types harder while terraforming than at the mystery or idle', () => {
    expect(typingAmount(true, false)).toBe(1);
    expect(typingAmount(true, true)).toBe(0.5);
    expect(typingAmount(false, false)).toBe(0.3);
  });

  it('rests the arms at -0.62 and raises them when floating', () => {
    expect(typingArmTarget(0, 0, 1)).toBeCloseTo(-0.62);
    expect(typingArmTarget(0, 1, 1)).toBeCloseTo(-0.62 + Math.sin(2) * 0.05);
    expect(floatArmTarget(0, 0, 0)).toBeCloseTo(-0.62);
    expect(floatArmTarget(0, 0, 1)).toBeCloseTo(-0.62 + 2.45);
  });

  it('cables sag on the ground and go taut without gravity', () => {
    expect(cableSag(0)).toBeCloseTo(0.07);
    expect(cableSag(1)).toBe(0);
  });
});

describe('walkie model', () => {
  it('adds 11 boxes and registers the antenna LED', () => {
    const primitives = createPrimitives();
    const g = new THREE.Group();
    buildWalkieModel(g, primitives);
    expect(g.children).toHaveLength(11);
    expect(primitives.registry.leds).toHaveLength(1);
    expect(primitives.registry.leds[0].position.toArray()).toEqual([-0.022, 0.14, 0]);
  });
});
