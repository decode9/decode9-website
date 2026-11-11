import { useMemo } from 'react';
import type { RichText } from '@/interfaces/profile';
import type { HeadlineWord } from './interface';

/** Splits the headline into words (accent words keep their colour), each with a staggered delay. */
const useStop = (title: RichText | undefined) =>
  useMemo(() => {
    if (!title) return { words: [] as HeadlineWord[], label: '' };
    const raw = title.flatMap((seg) => {
      const acc = typeof seg !== 'string';
      const text = typeof seg === 'string' ? seg : seg.em;
      return text.trim().split(/\s+/).filter(Boolean).map((word) => ({ word, acc }));
    });
    const label = title.map((s) => (typeof s === 'string' ? s : s.em)).join('').trim();
    return { words: raw.map((w, i) => ({ ...w, delay: `${(i * 0.07).toFixed(2)}s` })), label };
  }, [title]);

export default useStop;
