import type { RefObject } from 'react';
import type { CaseStudy, ProjectId } from '@/interfaces';

export interface CaseCopy {
  role: string;
  sector: string;
  summary: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  metrics: { value: string; label: string }[];
  alt: string;
}

export interface WorkLabels {
  poweredBy: string;
  visit: string;
  details: string;
  close: string;
  labels: Record<'role' | 'sector' | 'challenge' | 'solution' | 'outcomes' | 'stack' | 'since', string>;
  status: Record<'live' | 'private' | 'building', string>;
}

export interface UseWorkReturn {
  sectionRef: RefObject<HTMLDivElement>;
  trackRef: RefObject<HTMLDivElement>;
  active: number;
  /** The study shown in the case-study dialog, if any. */
  openStudy: CaseStudy | null;
  open: (id: ProjectId) => void;
  close: () => void;
  visit: (id: ProjectId) => void;
}
