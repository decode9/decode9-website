import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { stackCategories } from '@/data/stack';
import useReveal from '@/hooks/useReveal';
import { trackEvent } from '@/lib/analytics';
import { Flip } from '@/lib/motion/gsap';
import type { StackFilter, UseTechStackReturn } from './interface';

/** Filtering brings the chosen layer to the front; Flip animates the reflow. */
const useTechStack = (): UseTechStackReturn => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [filter, setFilterState] = useState<StackFilter>('all');
  const flipState = useRef<Flip.FlipState | null>(null);
  useReveal(scopeRef, { vertical: 'top 85%' });

  const setFilter = useCallback((next: StackFilter) => {
    const cards = scopeRef.current?.querySelectorAll('[data-stack-card]');
    if (cards) flipState.current = Flip.getState(cards);
    setFilterState(next);
    trackEvent('stack_filter', { category: next });
  }, []);

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    flipState.current = null;
    Flip.from(state, { duration: 0.7, ease: 'power3.inOut', stagger: 0.02, absolute: false });
  }, [filter]);

  const ordered =
    filter === 'all'
      ? stackCategories
      : [
          ...stackCategories.filter((category) => category.key === filter),
          ...stackCategories.filter((category) => category.key !== filter),
        ];

  return { scopeRef, filter, setFilter, ordered };
};

export default useTechStack;
