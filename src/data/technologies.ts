import { Technology } from '@/interfaces';

export const technologies: Technology[] = [
  // Languages
  { name: 'TypeScript', icon: 'SiTypescript', category: 'language', proficiency: 'expert', color: '#3178C6' },
  { name: 'JavaScript', icon: 'SiJavascript', category: 'language', proficiency: 'expert', color: '#F7DF1E' },
  { name: 'Python', icon: 'SiPython', category: 'language', proficiency: 'advanced', color: '#3776AB' },
  { name: 'Java', icon: 'SiOpenjdk', category: 'language', proficiency: 'advanced', color: '#ED8B00' },
  { name: 'C#', icon: 'SiCsharp', category: 'language', proficiency: 'advanced', color: '#512BD4' },
  { name: 'PHP', icon: 'SiPhp', category: 'language', proficiency: 'advanced', color: '#777BB4' },
  
  // Frontend
  { name: 'React', icon: 'SiReact', category: 'frontend', proficiency: 'expert', color: '#61DAFB' },
  { name: 'Next.js', icon: 'SiNextdotjs', category: 'frontend', proficiency: 'expert', color: '#FFFFFF' },
  { name: 'React Native', icon: 'SiReact', category: 'frontend', proficiency: 'expert', color: '#61DAFB' },
  { name: 'Tailwind CSS', icon: 'SiTailwindcss', category: 'frontend', proficiency: 'expert', color: '#06B6D4' },
  { name: 'GraphQL', icon: 'SiGraphql', category: 'frontend', proficiency: 'advanced', color: '#E10098' },
  
  // Backend
  { name: 'Node.js', icon: 'SiNodedotjs', category: 'backend', proficiency: 'expert', color: '#339933' },
  { name: 'Express', icon: 'SiExpress', category: 'backend', proficiency: 'expert', color: '#FFFFFF' },
  { name: 'NestJS', icon: 'SiNestjs', category: 'backend', proficiency: 'advanced', color: '#E0234E' },
  { name: 'gRPC', icon: 'SiGrpc', category: 'backend', proficiency: 'advanced', color: '#244C5A' },
  
  // Databases
  { name: 'PostgreSQL', icon: 'SiPostgresql', category: 'database', proficiency: 'expert', color: '#4169E1' },
  { name: 'MongoDB', icon: 'SiMongodb', category: 'database', proficiency: 'expert', color: '#47A248' },
  { name: 'MySQL', icon: 'SiMysql', category: 'database', proficiency: 'advanced', color: '#4479A1' },
  { name: 'Redis', icon: 'SiRedis', category: 'database', proficiency: 'advanced', color: '#DC382D' },
  { name: 'SQLite', icon: 'SiSqlite', category: 'database', proficiency: 'advanced', color: '#003B57' },
  
  // DevOps
  { name: 'Docker', icon: 'SiDocker', category: 'devops', proficiency: 'expert', color: '#2496ED' },
  { name: 'Kubernetes', icon: 'SiKubernetes', category: 'devops', proficiency: 'advanced', color: '#326CE5' },
  { name: 'AWS', icon: 'SiAmazonwebservices', category: 'devops', proficiency: 'advanced', color: '#FF9900' },
  { name: 'DigitalOcean', icon: 'SiDigitalocean', category: 'devops', proficiency: 'expert', color: '#0080FF' },
  { name: 'GitHub Actions', icon: 'SiGithubactions', category: 'devops', proficiency: 'expert', color: '#2088FF' },
  { name: 'Jenkins', icon: 'SiJenkins', category: 'devops', proficiency: 'advanced', color: '#D24939' },
  
  // Tools
  { name: 'Git', icon: 'SiGit', category: 'tools', proficiency: 'expert', color: '#F05032' },
  { name: 'VS Code', icon: 'SiVisualstudiocode', category: 'tools', proficiency: 'expert', color: '#007ACC' },
  { name: 'Figma', icon: 'SiFigma', category: 'tools', proficiency: 'intermediate', color: '#F24E1E' },
  { name: 'Linux', icon: 'SiLinux', category: 'tools', proficiency: 'expert', color: '#FCC624' },
];

export const techCategories = [
  { id: 'all', label: 'Todas' },
  { id: 'language', label: 'Lenguajes' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Bases de Datos' },
  { id: 'devops', label: 'DevOps' },
  { id: 'tools', label: 'Herramientas' },
];

