import type { RefObject } from 'react';
import type { StackCategory, StackCategoryKey } from '@/interfaces';

export type StackFilter = StackCategoryKey | 'all';

export interface UseTechStackReturn {
  scopeRef: RefObject<HTMLDivElement>;
  filter: StackFilter;
  setFilter: (filter: StackFilter) => void;
  ordered: StackCategory[];
}
