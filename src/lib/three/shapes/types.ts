import type { ShapeId } from '@/interfaces/scene';

/** Builds `count` target positions (xyz interleaved) for the particle field. */
export interface ShapeProvider {
  id: ShapeId;
  build: (count: number, random: () => number) => Float32Array;
}
