import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <SectionWrapper className="pt-24">
      <div className="container mx-auto px-4 md:px-6">
        <Link href="/projects" className="inline-flex items-center text-white/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a proyectos
        </Link>

        <div className="space-y-12">
          {/* Hero */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{project.title}</h1>
              <p className="text-white/70 text-lg mt-2">{project.description}</p>
            </div>
          </div>

          {/* Grid de detalles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
                <p className="text-white/70">{project.longDescription}</p>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Problema</h2>
                <p className="text-white/70">{project.problem}</p>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Solución</h2>
                <p className="text-white/70">{project.solution}</p>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Arquitectura</h2>
                <p className="text-white/70">{project.architecture}</p>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Resultados</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  {project.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Aprendizajes</h2>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  {project.learnings.map((learning, i) => (
                    <li key={i}>{learning}</li>
                  ))}
                </ul>
              </GlassPanel>
            </div>

            <div className="space-y-8">
              <GlassPanel className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Enlaces</h3>
                {project.links.demo && (
                  <Link href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full" icon={ExternalLink} iconPosition="right">
                      Demo en vivo
                    </Button>
                  </Link>
                )}
                {project.links.github && (
                  <Link href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full" icon={Github} iconPosition="right">
                      Código fuente
                    </Button>
                  </Link>
                )}
              </GlassPanel>

              {project.gallery.length > 0 && (
                <GlassPanel className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Galería</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={img} alt={`${project.title} - ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}