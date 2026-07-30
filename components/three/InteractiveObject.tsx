'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useMouse } from '@/hooks/useMouse';

interface InteractiveObjectProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  position = [0, 0, 0],
  color = '#6C63FF',
  size = 1,
}) => {
  const meshRef = useRef<Mesh>(null);
  const mouse = useMouse();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotación suave
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;

      // Seguir al mouse de manera sutil
      const x = (mouse.x / window.innerWidth) * 2 - 1;
      const y = -(mouse.y / window.innerHeight) * 2 + 1;
      meshRef.current.position.x = position[0] + x * 0.3;
      meshRef.current.position.y = position[1] + y * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  );
};