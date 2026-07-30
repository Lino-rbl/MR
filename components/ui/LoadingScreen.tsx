'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="text-white/60 text-sm tracking-widest">CARGANDO</p>
      </div>
    </motion.div>
  );
};