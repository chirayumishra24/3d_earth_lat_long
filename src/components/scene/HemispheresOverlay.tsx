'use client';

import React from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '@/lib/geo';

export type HemisphereMode = 'none' | 'north_south' | 'east_west';

interface HemispheresOverlayProps {
  mode: HemisphereMode;
}

export const HemispheresOverlay: React.FC<HemispheresOverlayProps> = ({ mode }) => {
  if (mode === 'none') return null;

  const r = GLOBE_RADIUS + 0.008;

  return (
    <group>
      {/* 1. NORTH vs SOUTH HEMISPHERES */}
      {mode === 'north_south' && (
        <group>
          {/* Northern Hemisphere Dome (Cyan-Blue Tint) */}
          <mesh rotation={[0, 0, 0]}>
            <sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial
              color="#38BDF8"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Southern Hemisphere Dome (Amber-Orange Tint) */}
          <mesh rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* 2. EAST vs WEST HEMISPHERES */}
      {mode === 'east_west' && (
        <group>
          {/* Eastern Hemisphere Half (Green Tint: 0° to 180°) */}
          <mesh rotation={[0, 0, 0]}>
            <sphereGeometry args={[r, 32, 32, 0, Math.PI, 0, Math.PI]} />
            <meshBasicMaterial
              color="#34D399"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Western Hemisphere Half (Purple Tint: 180° to 360°) */}
          <mesh rotation={[0, Math.PI, 0]}>
            <sphereGeometry args={[r, 32, 32, 0, Math.PI, 0, Math.PI]} />
            <meshBasicMaterial
              color="#A78BFA"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
