'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className,
  id,
  delay = 0,
}) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={cn('py-20 md:py-28', className)}
    >
      {children}
    </motion.section>
  );
};