/** Keys match `capabilities.services.<key>` in the dictionaries. */
export type ServiceKey = 'fullstack' | 'mvp' | 'auto' | 'arch' | 'ai' | 'devops' | 'consult' | 'proc';

export interface Service {
  key: ServiceKey;
  icon: string;
  techChips: string[];
}

export type ProcessPhase = 'discover' | 'architect' | 'build' | 'automate' | 'launch' | 'iterate';

export interface ProcessStep {
  phase: ProcessPhase;
  step: number;
}

export type StackCategoryKey = 'lang' | 'front' | 'back' | 'db' | 'cloud' | 'devops' | 'ai';

export interface StackCategory {
  key: StackCategoryKey;
  icon: string;
  tags: string[];
}
