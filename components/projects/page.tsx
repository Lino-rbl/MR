import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SectionWrapper } from '@/components/layout/SectionWrapper';

export default function ProjectsPage() {
  return (
    <SectionWrapper className="pt-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Proyectos"
          subtitle="Todos mis trabajos"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}