'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlassPanel } from './GlassPanel';
import { Button } from './Button';
import { Project } from '@/data/projects';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <GlassPanel className="overflow-hidden group hover:scale-[1.02] transition-transform">
      <div className="relative h-48 w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="text-white/60 text-sm">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/50"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-white/30 text-xs">+{project.technologies.length - 3}</span>
          )}
        </div>
        <Link href={`/projects/${project.slug}`}>
          <Button variant="ghost" size="sm" className="mt-2" icon={ArrowRight} iconPosition="right">
            Ver detalles
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
};