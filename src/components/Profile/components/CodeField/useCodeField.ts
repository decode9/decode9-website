import { useEffect, useState } from 'react';
import type { FloatingSnippet } from './interface';

/** Random layout of the floating snippets, computed on the client (Math.random is not SSR-stable). */
const useCodeField = (snippets: readonly string[], count: number): FloatingSnippet[] => {
  const [items, setItems] = useState<FloatingSnippet[]>([]);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setItems(
      Array.from({ length: count }, (_, i) => ({
        text: snippets[i % snippets.length],
        left: `${Math.random() * 92}%`,
        top: reduce ? `${Math.random() * 90}%` : undefined,
        duration: `${28 + Math.random() * 26}s`,
        delay: `${-Math.random() * 50}s`,
      })),
    );
  }, [snippets, count]);
  return items;
};

export default useCodeField;
