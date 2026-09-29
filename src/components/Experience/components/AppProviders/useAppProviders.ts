import { useMemo } from 'react';
import type { SceneSnapshot } from '@/interfaces/scene';
import type { Dictionary } from '@/i18n';
import { chapters } from '@/data/chapters';
import useChapterNavigation from '@/hooks/useChapterNavigation';
import useReducedMotion from '@/hooks/useReducedMotion';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import createAgent from '@/lib/agent/createAgent';
import { readSolvoConfig } from '@/lib/config/env';
import createBootSequence from '@/lib/scene/createBootSequence';
import createSceneStore from '@/lib/scene/createSceneStore';
import { browserStorage } from '@/utils/storage';

const initialScene: SceneSnapshot = { ...chapters[0]!.scene, focus: null, thinking: false, loading: 0 };

/** Composition root: picks the adapters the rest of the app only knows through interfaces. */
const useAppProviders = (dictionary: Dictionary) => {
  const reducedMotion = useReducedMotion();
  useSmoothScroll(reducedMotion);
  const navigate = useChapterNavigation();

  const offlineReply = dictionary.guide.offlineReply;
  const agent = useMemo(
    () =>
      createAgent({
        solvo: readSolvoConfig(),
        copy: { reply: offlineReply },
        storage: browserStorage,
        fetch: (input, init) => fetch(input, init),
      }),
    [offlineReply],
  );
  const scene = useMemo(() => createSceneStore(initialScene), []);
  const boot = useMemo(() => createBootSequence(), []);

  return { agent, scene, boot, navigate, storage: browserStorage };
};

export default useAppProviders;
