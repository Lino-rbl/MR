import React from 'react';
import Link from 'next/link';
import { socialLinks } from '@/data/social';
import * as Icons from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface/50 border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <p className="text-white/60 text-sm">
            © {currentYear} · Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => {
              const Icon = Icons[social.icon as keyof typeof Icons] as React.ElementType;
              return (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  {Icon && <Icon size={20} />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};