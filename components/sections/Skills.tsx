'use client';

import React from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SkillCard } from '@/components/shared/SkillCard';
import { skills } from '@/data/skills';
import { Reveal } from '@/components/animations/Reveal';

export const Skills: React.FC = () => {
  const categories = ['frontend', 'backend', 'devops', 'design'] as const;

  const categoryLabels = {
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    design: 'Diseño',
  };

  return (
    <SectionWrapper id="skills" className="bg-surface/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Habilidades"
          subtitle="Tecnologías y herramientas que domino"
        />

        <div className="space-y-12 mt-12">
          {categories.map((category) => {
            const filtered = skills.filter((s) => s.category === category);
            if (filtered.length === 0) return null;
            return (
              <div key={category}>
                <Reveal>
                  <h3 className="text-xl font-semibold text-white/80 mb-4">
                    {categoryLabels[category]}
                  </h3>
                </Reveal>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((skill, index) => (
                    <Reveal key={skill.name} delay={index * 0.05}>
                      <SkillCard name={skill.name} level={skill.level} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};