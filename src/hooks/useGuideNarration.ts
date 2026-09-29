import { useEffect, useRef, useState } from 'react';
import type { AgentMessage, ChapterId } from '@/interfaces';

interface UseGuideNarrationOptions {
  activeChapter: ChapterId;
  /** Narration templates per chapter; `{name}` is resolved at render time. */
  lines: Record<ChapterId, string[]>;
  greeting: string;
  append: (messages: AgentMessage[]) => void;
}

interface UseGuideNarrationReturn {
  /** Latest narration line, shown as a caption while the console is collapsed. */
  subtitle: string;
}

/** Wait before narrating, so scrolling quickly through chapters doesn't flood the transcript. */
const SETTLE_MS = 700;
const LINE_GAP_MS = 1600;

const guideMessage = (id: string, text: string): AgentMessage => ({
  id,
  role: 'guide',
  text,
  at: new Date().toISOString(),
  attachment: null,
});

const useGuideNarration = ({
  activeChapter,
  lines,
  greeting,
  append,
}: UseGuideNarrationOptions): UseGuideNarrationReturn => {
  const [subtitle, setSubtitle] = useState(greeting);
  const narrated = useRef<Set<ChapterId>>(new Set());

  useEffect(() => {
    append([guideMessage('guide-greeting', greeting)]);
  }, [append, greeting]);

  useEffect(() => {
    if (narrated.current.has(activeChapter)) return undefined;
    const chapterLines = lines[activeChapter] ?? [];
    const timers = chapterLines.map((line, index) =>
      setTimeout(
        () => {
          narrated.current.add(activeChapter);
          append([guideMessage(`guide-${activeChapter}-${index}`, line)]);
          setSubtitle(line);
        },
        SETTLE_MS + index * LINE_GAP_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [activeChapter, append, lines]);

  return { subtitle };
};

export default useGuideNarration;
