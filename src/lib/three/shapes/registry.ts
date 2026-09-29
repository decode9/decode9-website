import type { ShapeId } from '@/interfaces/scene';
import { createRandom } from '@/utils/math';
import type { ShapeProvider } from './types';

export interface ShapeRegistry {
  get: (id: ShapeId) => Float32Array | null;
  register: (provider: ShapeProvider) => void;
  has: (id: ShapeId) => boolean;
}

/** Builds shapes on first use and caches them; every build uses its own seeded generator. */
const createShapeRegistry = (count: number, providers: ShapeProvider[], seed = 9): ShapeRegistry => {
  const available = new Map<ShapeId, ShapeProvider>(providers.map((provider) => [provider.id, provider]));
  const built = new Map<ShapeId, Float32Array>();

  return {
    get: (id) => {
      const cached = built.get(id);
      if (cached) return cached;
      const provider = available.get(id);
      if (!provider) return null;
      const positions = provider.build(count, createRandom(seed + id.length * 131));
      built.set(id, positions);
      return positions;
    },
    register: (provider) => {
      available.set(provider.id, provider);
      built.delete(provider.id);
    },
    has: (id) => available.has(id),
  };
};

export default createShapeRegistry;
