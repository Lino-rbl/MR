'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Sparkles } from 'lucide-react';
import { AnimatedText } from '@/components/animations/AnimatedText';
import { Button } from '@/components/ui/Button';
import { Scene } from '@/components/three/Scene';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Fondo 3D */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/50 via-background/30 to-background/80" />

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm"
            >
              <Sparkles size={16} />
              <span>Desarrollador Creativo</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <AnimatedText text="Construyendo el" className="block text-white" />
              <AnimatedText text="futuro digital" className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" />
            </h1>

            <p className="text-lg text-white/70 max-w-lg">
              Especialista en experiencias interactivas, animaciones y arquitectura frontend de alto rendimiento.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/projects">
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  Ver proyectos
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contáctame
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-white/40 text-sm">
              <span className="flex items-center space-x-2">
                <Code size={16} />
                <span>5+ años</span>
              </span>
              <span>•</span>
              <span>20+ proyectos</span>
              <span>•</span>
              <span>10+ clientes</span>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};