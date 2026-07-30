'use client';

import React, { useRef } from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { Lights } from './Lights';
import { InteractiveObject } from './InteractiveObject';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const Scene: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const objectsCount = isMobile ? 3 : 6;

  const positions: [number, number, number][] = [
    [0, 0, 0],
    [1.5, 1, -1],
    [-1.5, 1, -1],
    [1.5, -1, -1],
    [-1.5, -1, -1],
    [0, 1.8, -1],
  ];

  const colors = ['#6C63FF', '#FF6584', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];

  return (
    <ThreeCanvas className="w-full h-full" cameraPosition={[0, 0, 5]}>
      <Lights />
      {positions.slice(0, objectsCount).map((pos, i) => (
        <InteractiveObject key={i} position={pos} color={colors[i % colors.length]} size={0.4 + Math.random() * 0.3} />
      ))}
    </ThreeCanvas>
  );
};