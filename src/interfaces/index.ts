// Technology interface
export interface Technology {
  name: string;
  icon: string;
  category: TechCategory;
  proficiency: 'expert' | 'advanced' | 'intermediate';
  color?: string;
}

export type TechCategory = 
  | 'language' 
  | 'frontend' 
  | 'backend' 
  | 'database' 
  | 'devops' 
  | 'tools';

// Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: ProjectCategory;
  repoUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  year: number;
}

export type ProjectCategory = 
  | 'web' 
  | 'mobile' 
  | 'api' 
  | 'devops' 
  | 'automation' 
  | 'game';

// Experience interface
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

// Architecture example interface
export interface ArchitectureExample {
  id: string;
  title: string;
  description: string;
  diagram?: string;
  code?: string;
  language?: string;
  tags: string[];
}

// Code problem interface
export interface CodeProblem {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  explanation: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// Navigation item interface
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Social link interface
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

