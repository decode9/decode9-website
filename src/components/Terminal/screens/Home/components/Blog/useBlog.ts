'use client';

import { useEffect, useRef, useState } from 'react';
import { BLOG_LINES } from '@/data/terminal/home';
import type { Bilingual } from '@/interfaces/terminal';

export interface BlogLine {
  id: number;
  t: Bilingual;
  ok: boolean;
  /** "session opened: " line (prefix + name). */
  user?: string;
}

const MAX_LINES = 5;

/**
 * Rolling log (original runBlog): one line every 1.6 s (4 s with reduced motion), keeps the last five.
 * The login announcement goes right after the first line, as in the original.
 */
const useBlog = (announce: string | null, reduceMotion: boolean): BlogLine[] => {
  const [lines, setLines] = useState<BlogLine[]>([]);
  const seq = useRef(0);

  useEffect(() => {
    let k = 0;
    let timer = 0;
    setLines([]);
    const push = (line: Omit<BlogLine, 'id'>) => {
      seq.current += 1;
      const next = { ...line, id: seq.current };
      setLines((list) => [...list, next].slice(-MAX_LINES));
    };
    const add = () => {
      const i = k % BLOG_LINES.length;
      push({ t: BLOG_LINES[i], ok: i === 4 });
      k += 1;
      timer = window.setTimeout(add, reduceMotion ? 4000 : 1600);
    };
    add();
    if (announce) push({ t: ['', ''], ok: true, user: announce });
    return () => window.clearTimeout(timer);
  }, [announce, reduceMotion]);

  return lines;
};

export default useBlog;
