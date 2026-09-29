import { useCallback, useEffect } from 'react';
import type { ChapterId } from '@/interfaces';
import { chapterById, chapterIds } from '@/data/chapters';
import { useGuide } from '@/context/GuideContext';
import { useSceneStore } from '@/context/SceneContext';
import { useScrollLayout } from '@/context/ScrollLayoutContext';
import useChapterNavigation from '@/hooks/useChapterNavigation';
import useChapterTriggers from '@/hooks/useChapterTriggers';
import { trackEvent } from '@/lib/analytics';

const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * When a chapter takes the screen: tell the guide, restage the scene, retint
 * the UI accent. On the horizontal tour, ← / → jump between chapters.
 */
const useChapterConductor = () => {
  const { enterChapter, activeChapter } = useGuide();
  const scene = useSceneStore();
  const { mode } = useScrollLayout();
  const navigate = useChapterNavigation();

  const onEnter = useCallback(
    (id: ChapterId) => {
      const chapter = chapterById(id);
      enterChapter(id);
      scene.set({ ...chapter.scene, focus: null });
      document.documentElement.style.setProperty('--accent', chapter.scene.accent);
      trackEvent('chapter_view', { chapter: id });
    },
    [enterChapter, scene],
  );

  useChapterTriggers(chapterIds, onEnter);

  useEffect(() => {
    if (mode !== 'horizontal') return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      const step = KEY_STEP[event.key];
      if (!step || isTyping(event.target) || event.altKey || event.metaKey || event.ctrlKey) return;
      const next = chapterIds[chapterIds.indexOf(activeChapter) + step];
      if (!next) return;
      event.preventDefault();
      navigate(next);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeChapter, mode, navigate]);
};

export default useChapterConductor;
