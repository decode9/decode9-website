import type { StackCategoryKey } from '@/interfaces';
import type { StackFilter } from '../../interface';

export interface StackFiltersProps {
  label: string;
  allLabel: string;
  names: Record<StackCategoryKey, string>;
  keys: StackCategoryKey[];
  active: StackFilter;
  onChange: (filter: StackFilter) => void;
}
