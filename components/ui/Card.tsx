import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({ className, variant = 'default', children, ...props }) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  const variants = {
    default: 'bg-surface border border-white/10',
    glass: 'bg-glass-bg backdrop-blur-md border border-white/20',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};