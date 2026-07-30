export interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

export const navItems: NavItem[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Sobre mí', href: '/about' },
  { name: 'Habilidades', href: '/skills' },
  { name: 'Experiencia', href: '/experience' },
  { name: 'Proyectos', href: '/projects' },
  { name: 'Laboratorio', href: '/laboratory' },
  { name: 'Contacto', href: '/contact' },
  { name: 'Currículum', href: '/resume' },
];