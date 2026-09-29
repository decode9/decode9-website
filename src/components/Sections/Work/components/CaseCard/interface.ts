import type { CaseStudy } from '@/interfaces';
import type { CaseCopy, WorkLabels } from '../../interface';

export interface CaseCardProps {
  study: CaseStudy;
  copy: CaseCopy;
  labels: WorkLabels;
  index: number;
  total: number;
  onOpen: () => void;
  onVisit: () => void;
}
