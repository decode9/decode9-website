import type { ReactNode } from 'react';
import type { PageSummaryCopy } from '@/interfaces/seo';

export interface PageSummaryProps {
  copy: PageSummaryCopy;
  /**
   * The mounted page already shows this heading and copy (with its own h1): drop the summary on
   * mount so screen readers do not hear it twice. Children stay (e.g. the profile chapters).
   */
  replaceOnMount?: boolean;
  children?: ReactNode;
}
