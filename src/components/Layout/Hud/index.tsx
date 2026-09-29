'use client';

import ScrambleText from '@/components/UI/ScrambleText';
import { useDictionary } from '@/context/DictionaryContext';
import { useGuide } from '@/context/GuideContext';
import { chapterById } from '@/data/chapters';
import type { ChapterId } from '@/interfaces';
import useHud from './useHud';

/** Cinematic heads-up display: session clock and the chapter on screen. */
const Hud = () => {
  const { dictionary } = useDictionary();
  const { activeChapter } = useGuide();
  const hud = dictionary.hud;
  const { elapsed } = useHud();
  const chapterName = (dictionary.nav.chapters as Record<ChapterId, string>)[activeChapter];

  return (
    <div
      aria-hidden="true"
      data-ui="chrome"
      className="pointer-events-none fixed bottom-6 left-5 z-30 hidden rotate-180 items-center gap-4 [writing-mode:vertical-rl] min-[1400px]:flex"
    >
      <ScrambleText
        key={activeChapter}
        text={`CH.${chapterById(activeChapter).code} // ${chapterName}`}
        trigger="mount"
        duration={0.7}
        className="d9-hud-code"
      />
      <span className="d9-hud-label flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full bg-success"
          style={{ animation: 'pulse-dot 2.4s ease-in-out infinite' }}
        />
        {hud.session} · {hud.elapsed} {elapsed}
      </span>
    </div>
  );
};

export default Hud;
