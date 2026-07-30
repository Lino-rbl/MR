'use client';

import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface SkillCardProps {
  name: string;
  level: number;
}

export const SkillCard: React.FC<SkillCardProps> = ({ name, level }) => {
  return (
    <GlassPanel className="p-4 text-center">
      <p className="text-white font-medium">{name}</p>
      <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
          style={{ width: `${level}%` }}
        />
      </div>
      <p className="text-white/40 text-xs mt-1">{level}%</p>
    </GlassPanel>
  );
};