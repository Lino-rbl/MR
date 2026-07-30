'use client';

import React from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Timeline } from '@/components/shared/Timeline';
import { experiences } from '@/data/experience';

export const Experience: React.FC = () => {
  return (
    <SectionWrapper id="experience" className="bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Experiencia"
          subtitle="Trayectoria profesional y logros"
        />

        <div className="mt-12">
          <Timeline items={experiences} />
        </div>
      </div>
    </SectionWrapper>
  );
};