'use client';

import React from 'react';
import Link from 'next/link';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const featured = projects.filter((p) => p.featured).slice(0, 2);

  return (
    <SectionWrapper id="projects" className="bg-surface/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Proyectos destacados"
          subtitle="Algunos de mis trabajos más relevantes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/projects">
            <Button variant="outline" icon={ArrowRight} iconPosition="right">
              Ver todos los proyectos
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
};