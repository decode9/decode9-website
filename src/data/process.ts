import type { ProcessStep } from '@/interfaces';

export const processSteps: ProcessStep[] = [
  { id: 'step-1', step: 1, phase: 'discover' },
  { id: 'step-2', step: 2, phase: 'architect' },
  { id: 'step-3', step: 3, phase: 'build' },
  { id: 'step-4', step: 4, phase: 'automate' },
  { id: 'step-5', step: 5, phase: 'launch' },
  { id: 'step-6', step: 6, phase: 'iterate' },
];
