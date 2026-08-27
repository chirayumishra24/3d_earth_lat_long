'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const Starfield: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 4,500 random star positions and colors on large sphere
  const [positions, colors] = useMemo(() => {
    const count = 4500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute stars on a shell around radius 50 to 90
      const radius = 50 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Star hues: White, Pale Blue, Golden Yellow, Soft Amber
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        // Crisp White
        col[i * 3] = 0.95;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.85) {
        // Cyan / Blue giant
        col[i * 3] = 0.45;
        col[i * 3 + 1] = 0.75;
        col[i * 3 + 2] = 1.0;
      } else {
        // Amber / Warm star
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.85;
        col[i * 3 + 2] = 0.55;
      }
    }

    return [pos, col];
  }, []);

  // Subtle ambient rotation for space parallax
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
