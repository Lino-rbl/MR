'use client';

import React, { useEffect, useRef } from 'react';
import { useMouse } from '@/hooks/useMouse';

interface MouseFollowerProps {
  className?: string;
  size?: number;
  color?: string;
}

export const MouseFollower: React.FC<MouseFollowerProps> = ({
  className,
  size = 20,
  color = 'rgba(108, 99, 255, 0.3)',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMouse();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${mouse.x - size/2}px, ${mouse.y - size/2}px)`;
    }
  }, [mouse, size]);

  return (
    <div
      ref={ref}
      className={`fixed pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
};