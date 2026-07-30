'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface ThreeCanvasProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  enableControls?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  children,
  className,
  cameraPosition = [0, 0, 8],
  enableControls = true,
}) => {
  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
        {enableControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            enableDamping
            dampingFactor={0.05}
          />
        )}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
};