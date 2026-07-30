export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
}

export const skills: Skill[] = [
  { name: 'React', level: 95, category: 'frontend' },
  { name: 'Next.js', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 92, category: 'frontend' },
  { name: 'TailwindCSS', level: 88, category: 'frontend' },
  { name: 'Node.js', level: 80, category: 'backend' },
  { name: 'Python', level: 75, category: 'backend' },
  { name: 'Three.js', level: 70, category: 'frontend' },
  { name: 'Framer Motion', level: 85, category: 'frontend' },
  { name: 'GraphQL', level: 65, category: 'backend' },
  { name: 'Docker', level: 60, category: 'devops' },
  { name: 'UI/UX Design', level: 78, category: 'design' },
];