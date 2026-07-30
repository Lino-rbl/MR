'use client';

import React from 'react';
import { Particles } from '@/components/animations/Particles';

export const AnimatedBackground: React.FC = () => {
  return <Particles count={60} color="#6C63FF" className="fixed inset-0 z-0 opacity-30" />;
};