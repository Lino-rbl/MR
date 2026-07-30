'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassPanel className="p-8 text-center space-y-6">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-white">Página no encontrada</h2>
          <p className="text-white/60">
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" icon={Home} iconPosition="left">
                Inicio
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}