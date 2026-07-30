'use client';

import React from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Beaker, Code, Zap } from 'lucide-react';

export const Laboratory: React.FC = () => {
  const experiments = [
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: 'Experimento 1',
      description: 'Prueba de concepto con WebGL y shaders personalizados.',
    },
    {
      icon: <Zap className="w-8 h-8 text-secondary" />,
      title: 'Experimento 2',
      description: 'Animaciones avanzadas con Framer Motion y gestos.',
    },
    {
      icon: <Beaker className="w-8 h-8 text-yellow-400" />,
      title: 'Experimento 3',
      description: 'Integración de IA en el frontend con TensorFlow.js.',
    },
  ];

  return (
    <SectionWrapper id="laboratory" className="bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Laboratorio"
          subtitle="Exploraciones técnicas y experimentos"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {experiments.map((exp, index) => (
            <GlassPanel key={index} className="p-6 text-center space-y-4 hover:scale-105 transition-transform">
              <div className="flex justify-center">{exp.icon}</div>
              <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
              <p className="text-white/60">{exp.description}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};