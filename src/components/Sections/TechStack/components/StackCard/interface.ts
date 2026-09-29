import type { StackCategory } from '@/interfaces';

export interface StackCardProps {
  category: StackCategory;
  name: string;
  /** Another category is selected: this card steps back. */
  dimmed: boolean;
  selected: boolean;
}
