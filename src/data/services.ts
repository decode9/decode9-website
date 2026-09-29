import type { Service } from '@/interfaces';

export const services: Service[] = [
  { key: 'fullstack', icon: 'Layers', techChips: ['React', 'Node.js', 'TypeScript'] },
  { key: 'mvp', icon: 'Rocket', techChips: ['Next.js', 'Node.js', 'Postgres'] },
  { key: 'auto', icon: 'Workflow', techChips: ['Node.js', 'Python', 'n8n'] },
  { key: 'arch', icon: 'Share2', techChips: ['Serverless', 'Queues', 'MySQL'] },
  { key: 'ai', icon: 'Sparkles', techChips: ['LLM tools', 'pgvector', 'Guardrails'] },
  { key: 'devops', icon: 'Server', techChips: ['Terraform', 'AWS', 'Docker'] },
  { key: 'consult', icon: 'Compass', techChips: ['Architecture', 'Code review', 'Teams'] },
  { key: 'proc', icon: 'Gauge', techChips: ['Automation', 'Integrations', 'Data'] },
];
