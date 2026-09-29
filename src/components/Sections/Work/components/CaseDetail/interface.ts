import type { CaseStudy } from '@/interfaces';
import type { CaseCopy, WorkLabels } from '../../interface';

export interface CaseDetailProps {
  study: CaseStudy;
  copy: CaseCopy;
  labels: WorkLabels;
  onClose: () => void;
  onVisit: () => void;
}
