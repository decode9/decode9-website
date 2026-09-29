import isotypePaths from '@/data/isotype.paths.json';
import type { ShapeProvider } from './types';

type Point = [number, number];

interface Piece {
  material: string;
  points: Point[];
}

/** Same numbers as scripts/blender/build_isotype.py so the particles overlap the solid mark. */
const HEIGHT = 3.2;
const DEPTH: Record<string, [number, number]> = { red: [-0.13, 0.13], chrome: [-0.13, 0.03] };
const EDGE_SHARE = 0.32;

const pieces = (isotypePaths.pieces as { material: string; points: number[][] }[]).map<Piece>((piece) => ({
  material: piece.material,
  points: piece.points.map(([x, y]) => [x! * HEIGHT, y! * HEIGHT]),
}));

const allPoints = pieces.flatMap((piece) => piece.points);
const bounds = {
  minX: Math.min(...allPoints.map(([x]) => x)),
  maxX: Math.max(...allPoints.map(([x]) => x)),
  minY: Math.min(...allPoints.map(([, y]) => y)),
  maxY: Math.max(...allPoints.map(([, y]) => y)),
};
const center: Point = [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2];

/** Even–odd ray casting. */
export const insidePolygon = ([x, y]: Point, polygon: Point[]): boolean =>
  polygon.reduce((inside, [xi, yi], index) => {
    const [xj, yj] = polygon[(index + polygon.length - 1) % polygon.length]!;
    const crosses = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    return crosses ? !inside : inside;
  }, false);

const edges = pieces.flatMap((piece) =>
  piece.points.map((start, index) => {
    const end = piece.points[(index + 1) % piece.points.length]!;
    return { piece, start, end, length: Math.hypot(end[0] - start[0], end[1] - start[1]) };
  }),
);
const perimeter = edges.reduce((sum, edge) => sum + edge.length, 0);

const depthFor = (piece: Piece, random: () => number, onFace: boolean): number => {
  const [back, front] = DEPTH[piece.material] ?? DEPTH.chrome!;
  return onFace ? front : back + random() * (front - back);
};

const onEdge = (random: () => number): [number, number, number] => {
  const target = random() * perimeter;
  const { edge } = edges.reduce<{ acc: number; edge: (typeof edges)[number] | null }>(
    (state, candidate) =>
      state.edge
        ? state
        : state.acc + candidate.length >= target
          ? { acc: state.acc, edge: candidate }
          : { ...state, acc: state.acc + candidate.length },
    { acc: 0, edge: null },
  );
  const chosen = edge ?? edges[edges.length - 1]!;
  const t = random();
  const x = chosen.start[0] + (chosen.end[0] - chosen.start[0]) * t;
  const y = chosen.start[1] + (chosen.end[1] - chosen.start[1]) * t;
  return [x - center[0], y - center[1], depthFor(chosen.piece, random, random() < 0.7)];
};

const inside = (random: () => number): [number, number, number] => {
  const attempt = (tries: number): [number, number, number] => {
    const point: Point = [
      bounds.minX + random() * (bounds.maxX - bounds.minX),
      bounds.minY + random() * (bounds.maxY - bounds.minY),
    ];
    const piece = pieces.find((candidate) => insidePolygon(point, candidate.points));
    if (piece) return [point[0] - center[0], point[1] - center[1], depthFor(piece, random, random() < 0.6)];
    return tries > 0 ? attempt(tries - 1) : onEdge(random);
  };
  return attempt(40);
};

/**
 * The decode9 mark as particles, sampled straight from the polygons (area-uniform
 * inside, plus a share on the outlines for crisp edges). Available instantly —
 * no need to wait for the GLB — so the loader can assemble the mark from frame one.
 */
export const isotype: ShapeProvider = {
  id: 'isotype',
  build: (count, random) => {
    const positions = new Float32Array(count * 3);
    Array.from({ length: count }).forEach((_, index) => {
      positions.set(random() < EDGE_SHARE ? onEdge(random) : inside(random), index * 3);
    });
    return positions;
  },
};
