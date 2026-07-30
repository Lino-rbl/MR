'use client';

import React from 'react';

export const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6C63FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6584" />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />
    </>
  );
};