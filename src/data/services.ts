import type { Service } from '@/interfaces';

export const services: Service[] = [
  {
    id: 'full-stack',
    icon: 'Layers',
    order: 1,
    techChips: ['React', 'Node.js', 'TypeScript'],
  },
  {
    id: 'mvp',
    icon: 'Rocket',
    order: 2,
    techChips: ['React', 'Node.js', 'Postgres'],
  },
  {
    id: 'automation',
    icon: 'Workflow',
    order: 3,
    techChips: ['Python', 'Node.js', 'REST · gRPC'],
  },
  {
    id: 'scalable-arch',
    icon: 'Share2',
    order: 4,
    techChips: ['Microservices', 'gRPC', 'MySQL'],
  },
  {
    id: 'ai-product',
    icon: 'Sparkles',
    order: 5,
    techChips: ['LLM tooling', 'Python', 'APIs'],
  },
  {
    id: 'devops',
    icon: 'Server',
    order: 6,
    techChips: ['Docker', 'Kubernetes', 'AWS · Azure'],
  },
  {
    id: 'tech-consulting',
    icon: 'Compass',
    order: 7,
    techChips: ['Architecture', 'Code review', 'Strategy'],
  },
  {
    id: 'process-opt',
    icon: 'Gauge',
    order: 8,
    techChips: ['Automation', 'Integrations', 'Data'],
  },
];
