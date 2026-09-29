import type { ProcessStep } from '@/interfaces';

export const processSteps: ProcessStep[] = [
  { phase: 'discover', step: 1 },
  { phase: 'architect', step: 2 },
  { phase: 'build', step: 3 },
  { phase: 'automate', step: 4 },
  { phase: 'launch', step: 5 },
  { phase: 'iterate', step: 6 },
];
