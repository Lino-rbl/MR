import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ className, intensity = 'medium', children, ...props }) => {
  const intensities = {
    light: 'bg-white/5 backdrop-blur-sm',
    medium: 'bg-white/10 backdrop-blur-md',
    heavy: 'bg-white/15 backdrop-blur-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 shadow-lg',
        intensities[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};