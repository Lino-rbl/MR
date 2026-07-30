'use client';

import React from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { experiences } from '@/data/experience';
import { education } from '@/data/education';
import { skills } from '@/data/skills';

export const Resume: React.FC = () => {
  return (
    <SectionWrapper id="resume" className="bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Currículum"
          subtitle="Resumen de mi trayectoria profesional"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <GlassPanel className="p-6 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Experiencia
            </h3>
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/30 pl-4 py-2">
                <h4 className="text-white font-semibold">{exp.position}</h4>
                <p className="text-primary text-sm">{exp.company}</p>
                <p className="text-white/40 text-xs">
                  {exp.startDate} - {exp.endDate}
                </p>
                <ul className="mt-2 space-y-1 text-white/60 text-sm list-disc list-inside">
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </GlassPanel>

          <div className="space-y-8">
            <GlassPanel className="p-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileText size={20} className="text-secondary" />
                Educación
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-secondary/30 pl-4 py-2">
                  <h4 className="text-white font-semibold">{edu.degree}</h4>
                  <p className="text-secondary text-sm">{edu.institution}</p>
                  <p className="text-white/40 text-xs">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.description && (
                    <p className="text-white/60 text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </GlassPanel>

            <div className="flex justify-center">
              <Button variant="outline" icon={Download}>
                Descargar CV (PDF)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};