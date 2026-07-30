export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Senior Frontend Engineer',
    startDate: '2022-06',
    endDate: 'Presente',
    description: [
      'Lideré el desarrollo de la nueva plataforma de IA.',
      'Optimicé el rendimiento reduciendo el tiempo de carga en un 40%.',
      'Implementé CI/CD con GitHub Actions.',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    id: '2',
    company: 'StartupX',
    position: 'Full Stack Developer',
    startDate: '2020-01',
    endDate: '2022-05',
    description: [
      'Construí el MVP de una aplicación SaaS.',
      'Diseñé la arquitectura de microservicios.',
      'Integré pasarelas de pago y autenticación.',
    ],
    technologies: ['Node.js', 'React', 'MongoDB', 'Docker'],
  },
];