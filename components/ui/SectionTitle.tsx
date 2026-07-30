import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  center?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className,
  center = true,
}) => {
  return (
    <div className={cn('space-y-3', center && 'text-center', className)}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};