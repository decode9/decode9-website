import type { StackCategory } from '@/interfaces';

export const stackCategories: StackCategory[] = [
  { key: 'lang', icon: 'Code2', tags: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'Java', 'C#', 'PHP'] },
  {
    key: 'front',
    icon: 'LayoutDashboard',
    tags: ['React', 'Next.js', 'React Native', 'Expo', 'Angular', 'Tailwind', 'three.js', 'GSAP'],
  },
  {
    key: 'back',
    icon: 'ServerCog',
    tags: ['Node.js', 'Express', 'NestJS', 'FastAPI', 'REST', 'gRPC', 'Microservices'],
  },
  { key: 'db', icon: 'Database', tags: ['PostgreSQL', 'pgvector', 'MySQL', 'MongoDB', 'SQLite · SQLCipher', 'MSSQL'] },
  {
    key: 'cloud',
    icon: 'Cloud',
    tags: ['AWS Lambda', 'API Gateway', 'CloudFront', 'RDS', 'Amplify', 'Azure', 'Google Cloud', 'DigitalOcean'],
  },
  {
    key: 'devops',
    icon: 'GitBranch',
    tags: ['Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'SonarQube'],
  },
  { key: 'ai', icon: 'Bot', tags: ['LLM tool calling', 'RAG', 'MCP', 'AI agents', 'Guardrails', 'n8n'] },
];
