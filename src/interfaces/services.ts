export interface Service {
  id: string;
  icon: string;
  order: number;
  techChips: string[];
}

export type ProcessPhase =
  | 'discover'
  | 'architect'
  | 'build'
  | 'automate'
  | 'launch'
  | 'iterate';

export interface ProcessStep {
  id: string;
  step: number;
  phase: ProcessPhase;
}
