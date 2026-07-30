export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  gallery: string[];
  problem: string;
  solution: string;
  results: string[];
  learnings: string[];
  architecture: string;
  links: {
    demo?: string;
    github?: string;
  };
  featured: boolean;
  year: number;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'lino',
    title: 'Lino AI',
    description: 'Plataforma de automatización con inteligencia artificial.',
    longDescription: 'Lino AI es una plataforma que permite a las empresas automatizar tareas repetitivas usando modelos de IA personalizados.',
    technologies: ['React', 'Node.js', 'TensorFlow.js', 'WebRTC'],
    image: '/assets/images/lino-hero.jpg',
    gallery: ['/assets/images/lino-1.jpg', '/assets/images/lino-2.jpg'],
    problem: 'Las empresas pierden horas en tareas manuales.',
    solution: 'Creamos un sistema que aprende y automatiza flujos de trabajo.',
    results: ['Reducción del 70% en tiempo de procesamiento', 'Ahorro de 200h/mes'],
    learnings: ['Integración de modelos de ML en frontend', 'Optimización de WebRTC'],
    architecture: 'Arquitectura basada en microservicios con orquestación en Kubernetes.',
    links: {
      demo: 'https://lino.ai',
      github: 'https://github.com/example/lino',
    },
    featured: true,
    year: 2023,
  },
  {
    id: '2',
    slug: 'erp',
    title: 'ERP Modular',
    description: 'Sistema ERP moderno y escalable.',
    longDescription: 'ERP diseñado para PyMEs con módulos de finanzas, inventario y CRM.',
    technologies: ['Next.js', 'GraphQL', 'PostgreSQL', 'Tailwind'],
    image: '/assets/images/erp-hero.jpg',
    gallery: ['/assets/images/erp-1.jpg', '/assets/images/erp-2.jpg'],
    problem: 'Los ERPs tradicionales son lentos y difíciles de personalizar.',
    solution: 'Desarrollamos una arquitectura modular con API GraphQL.',
    results: ['Implementación en 3 empresas', 'Satisfacción del 95%'],
    learnings: ['Diseño de esquemas GraphQL', 'Optimización de consultas'],
    architecture: 'Arquitectura hexagonal con capas de dominio, aplicación e infraestructura.',
    links: {
      demo: 'https://erp.example.com',
      github: 'https://github.com/example/erp',
    },
    featured: true,
    year: 2024,
  },
  {
    id: '3',
    slug: 'network',
    title: 'Network Visualizer',
    description: 'Visualizador 3D de redes complejas.',
    longDescription: 'Herramienta interactiva para visualizar topologías de red en tiempo real.',
    technologies: ['Three.js', 'React Three Fiber', 'WebSocket'],
    image: '/assets/images/network-hero.jpg',
    gallery: ['/assets/images/network-1.jpg', '/assets/images/network-2.jpg'],
    problem: 'Los administradores de red necesitan visualizar grandes volúmenes de datos.',
    solution: 'Creamos una experiencia 3D con actualizaciones en tiempo real.',
    results: ['Adoptado por 5 departamentos de TI', 'Reducción de incidentes en un 30%'],
    learnings: ['Optimización de geometrías 3D', 'Manejo de datos en tiempo real'],
    architecture: 'Frontend en React con Three.js, backend en Node con WebSockets.',
    links: {
      demo: 'https://network.example.com',
      github: 'https://github.com/example/network',
    },
    featured: false,
    year: 2023,
  },
];