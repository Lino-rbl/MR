'use client';

import React from 'react';
import Image from 'next/image';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/animations/Reveal';
import { GlassPanel } from '@/components/ui/GlassPanel';

export const About: React.FC = () => {
  return (
    <SectionWrapper id="about" className="bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Sobre mí"
          subtitle="Conoce al desarrollador detrás de la pantalla"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <Reveal>
            <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src="/assets/images/profile.jpg"
                alt="Foto de perfil"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.2}>
            <GlassPanel className="p-8 space-y-6">
              <h3 className="text-2xl font-bold text-white">Hola, soy [Tu Nombre]</h3>
              <p className="text-white/70 leading-relaxed">
                Apasionado por la tecnología y el diseño, me especializo en crear experiencias digitales que combinan
                funcionalidad, estética y rendimiento. Con más de 5 años de experiencia en el desarrollo frontend,
                he trabajado en proyectos que van desde aplicaciones empresariales hasta experiencias interactivas en 3D.
              </p>
              <p className="text-white/70 leading-relaxed">
                Mi enfoque se basa en la arquitectura limpia, el código escalable y la innovación constante.
                Siempre estoy explorando nuevas tecnologías para llevar los límites de la web al siguiente nivel.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div>
                  <p className="text-primary font-bold">5+</p>
                  <p className="text-white/50 text-sm">Años de experiencia</p>
                </div>
                <div>
                  <p className="text-primary font-bold">20+</p>
                  <p className="text-white/50 text-sm">Proyectos entregados</p>
                </div>
                <div>
                  <p className="text-primary font-bold">10+</p>
                  <p className="text-white/50 text-sm">Clientes satisfechos</p>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
};