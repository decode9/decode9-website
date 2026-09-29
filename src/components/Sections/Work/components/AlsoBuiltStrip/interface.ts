import type { AlsoBuilt, AlsoBuiltId } from '@/interfaces';

export interface AlsoBuiltStripProps {
  title: string;
  items: AlsoBuilt[];
  descriptions: Record<AlsoBuiltId, string>;
}
