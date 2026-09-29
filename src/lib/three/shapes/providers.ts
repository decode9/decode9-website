import { isotype } from './isotype';
import type { ShapeProvider } from './types';

type Point = [number, number, number];

const gaussian = (random: () => number): number => {
  const u = Math.max(random(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
};

const cumulativeSums = (values: number[]): number[] =>
  values.map((_, index) => values.slice(0, index + 1).reduce((sum, value) => sum + value, 0));

type Generator = (random: () => number, index: number) => Point;

/** Fills `count` points, choosing a generator per point by weight. */
const weighted =
  (parts: [number, Generator][]) =>
  (count: number, random: () => number): Float32Array => {
    const thresholds = cumulativeSums(parts.map(([weight]) => weight));
    const total = thresholds[thresholds.length - 1] ?? 1;
    const positions = new Float32Array(count * 3);
    Array.from({ length: count }).forEach((_, index) => {
      const pick = random() * total;
      const chosen =
        parts[
          Math.max(
            0,
            thresholds.findIndex((threshold) => pick <= threshold),
          )
        ]!;
      positions.set(chosen[1](random, index), index * 3);
    });
    return positions;
  };

export const CONSTELLATION_NODES = 8;
const CONSTELLATION_RADIUS = 2.8;
const CONSTELLATION_TILT = 0.42;

/** Local position of a constellation node (one per service card). */
export const constellationNode = (index: number): Point => {
  const angle = (index / CONSTELLATION_NODES) * Math.PI * 2 + Math.PI / 2;
  const x = Math.cos(angle) * CONSTELLATION_RADIUS;
  const planeY = Math.sin(angle) * CONSTELLATION_RADIUS;
  return [x, planeY * Math.cos(CONSTELLATION_TILT), -planeY * Math.sin(CONSTELLATION_TILT)];
};

const lerpPoint = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const jitter = (point: Point, amount: number, random: () => number): Point => [
  point[0] + gaussian(random) * amount,
  point[1] + gaussian(random) * amount,
  point[2] + gaussian(random) * amount,
];

export const scatter: ShapeProvider = {
  id: 'scatter',
  build: weighted([
    [
      1,
      (random) => {
        const theta = random() * Math.PI * 2;
        const phi = Math.acos(random() * 2 - 1);
        const radius = 5 + random() * 7;
        return [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi) * 0.6,
          radius * Math.sin(phi) * Math.sin(theta) - 2,
        ];
      },
    ],
  ]),
};

export const helix: ShapeProvider = {
  id: 'helix',
  build: weighted([
    [
      0.72,
      (random) => {
        const t = random();
        const strand = random() < 0.5 ? 0 : Math.PI;
        const angle = t * Math.PI * 7 + strand;
        return jitter([Math.cos(angle) * 1.25, t * 5.6 - 2.8, Math.sin(angle) * 1.25], 0.05, random);
      },
    ],
    [
      0.2,
      (random) => {
        const rung = Math.floor(random() * 13);
        const t = (rung + 0.5) / 13;
        const angle = t * Math.PI * 7;
        const a: Point = [Math.cos(angle) * 1.25, t * 5.6 - 2.8, Math.sin(angle) * 1.25];
        const b: Point = [-a[0], a[1], -a[2]];
        return jitter(lerpPoint(a, b, random()), 0.025, random);
      },
    ],
    [0.08, (random) => jitter([0, random() * 6 - 3, 0], 1.4, random)],
  ]),
};

export const constellation: ShapeProvider = {
  id: 'constellation',
  build: weighted([
    [0.55, (random) => jitter(constellationNode(Math.floor(random() * CONSTELLATION_NODES)), 0.2, random)],
    [
      0.25,
      (random) => {
        const index = Math.floor(random() * CONSTELLATION_NODES);
        return jitter(
          lerpPoint(constellationNode(index), constellationNode((index + 1) % CONSTELLATION_NODES), random()),
          0.03,
          random,
        );
      },
    ],
    [
      0.12,
      (random) =>
        jitter(
          lerpPoint([0, 0, 0], constellationNode(Math.floor(random() * CONSTELLATION_NODES)), random() * 0.85),
          0.02,
          random,
        ),
    ],
    [0.08, (random) => jitter([0, 0, 0], 0.35, random)],
  ]),
};

export const grid: ShapeProvider = {
  id: 'grid',
  build: weighted([
    [
      1,
      (random) => {
        const alongX = random() < 0.5;
        const line = Math.floor(random() * 22) / 21;
        const t = random();
        const x = alongX ? t * 18 - 9 : line * 18 - 9;
        const z = alongX ? line * 12 - 8 : t * 12 - 8;
        const y = Math.sin(x * 0.55) * Math.cos(z * 0.45) * 0.45 - 1.9;
        return [x, y, z];
      },
    ],
  ]),
};

const rectBorder = (width: number, height: number, t: number): [number, number] => {
  const perimeter = 2 * (width + height);
  const d = t * perimeter;
  if (d < width) return [d - width / 2, height / 2];
  if (d < width + height) return [width / 2, height / 2 - (d - width)];
  if (d < 2 * width + height) return [width / 2 - (d - width - height), -height / 2];
  return [-width / 2, -height / 2 + (d - 2 * width - height)];
};

export const monolith: ShapeProvider = {
  id: 'monolith',
  build: weighted([
    [
      0.45,
      (random) => {
        const [x, y] = rectBorder(3.8, 2.4, random());
        return jitter([x, y, 0], 0.035, random);
      },
    ],
    [
      0.35,
      (random) => {
        const row = Math.floor(random() * 26) / 25;
        return [random() * 3.6 - 1.8, row * 2.2 - 1.1, gaussian(random) * 0.02];
      },
    ],
    [
      0.2,
      (random) => {
        const [x, y] = rectBorder(3.8, 2.4, random());
        return [x, y, -random() * 1.6];
      },
    ],
  ]),
};

export const sphere: ShapeProvider = {
  id: 'sphere',
  build: weighted([
    [
      0.7,
      (random, index) => {
        const golden = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - (((index * 7919) % 10007) / 10006) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = golden * index;
        return jitter([Math.cos(theta) * radius * 2.5, y * 2.5, Math.sin(theta) * radius * 2.5], 0.02, random);
      },
    ],
    [
      0.3,
      (random) => {
        const angle = random() * Math.PI * 2;
        const ring = random() < 0.5 ? 0.5 : -0.35;
        const r = 3.5;
        return jitter(
          [Math.cos(angle) * r, Math.sin(angle) * r * Math.sin(ring), Math.sin(angle) * r * Math.cos(ring)],
          0.03,
          random,
        );
      },
    ],
  ]),
};

const pathPoint = (t: number): Point => [
  t * 11 - 5.5,
  Math.sin(t * Math.PI * 1.5) * 1.1,
  Math.cos(t * Math.PI * 2) * 1.4 - 1,
];

export const path: ShapeProvider = {
  id: 'path',
  build: weighted([
    [0.5, (random) => jitter(pathPoint(random()), 0.06, random)],
    [
      0.5,
      (random) => {
        const gate = Math.floor(random() * 6);
        const t = (gate + 0.5) / 6;
        const center = pathPoint(t);
        const angle = random() * Math.PI * 2;
        return jitter([center[0], center[1] + Math.cos(angle) * 0.6, center[2] + Math.sin(angle) * 0.6], 0.02, random);
      },
    ],
  ]),
};

/** The decode9 notch: a square frame with the top-right corner cut at 45°. */
const notchedFrame = (t: number, size: number, notch: number): [number, number] => {
  const half = size / 2;
  const corners: [number, number][] = [
    [-half, half],
    [half - notch, half],
    [half, half - notch],
    [half, -half],
    [-half, -half],
  ];
  const segments = corners.map((corner, index) => [corner, corners[(index + 1) % corners.length]!] as const);
  const lengths = segments.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const ends = cumulativeSums(lengths);
  const target = t * (ends[ends.length - 1] ?? 0);
  const index = Math.max(
    0,
    ends.findIndex((end) => target <= end),
  );
  const [a, b] = segments[index]!;
  const local = (target - (ends[index]! - lengths[index]!)) / lengths[index]!;
  return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local];
};

export const portal: ShapeProvider = {
  id: 'portal',
  build: weighted([
    [
      0.6,
      (random) => {
        const [x, y] = notchedFrame(random(), 4.6, 1.0);
        return jitter([x, y, -0.6], 0.05, random);
      },
    ],
    [
      0.4,
      (random) => {
        const radius = Math.pow(random(), 0.6) * 2.1;
        const angle = random() * Math.PI * 2 + radius * 1.4;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius, -1.2 - radius * 0.4];
      },
    ],
  ]),
};

export const proceduralShapes: ShapeProvider[] = [
  scatter,
  isotype,
  helix,
  constellation,
  grid,
  monolith,
  sphere,
  path,
  portal,
];
