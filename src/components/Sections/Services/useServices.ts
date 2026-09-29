import { useCallback, useRef } from 'react';
import { useSceneStore } from '@/context/SceneContext';
import useReveal from '@/hooks/useReveal';

const useServices = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scene = useSceneStore();
  useReveal(ref, { vertical: 'top 85%' });

  const focusNode = useCallback((index: number | null) => scene.set({ focus: index }), [scene]);

  return { ref, focusNode };
};

export default useServices;
