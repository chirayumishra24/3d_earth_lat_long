'use client';

import React, { useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { GLOBAL_LOCATIONS, GLOBE_RADIUS, latLonToVector3 } from '@/lib/geo';

interface ReferenceCitiesProps {
  showCities: boolean;
  onSelectCity?: (lat: number, lon: number) => void;
}

export const ReferenceCities: React.FC<ReferenceCitiesProps> = ({
  showCities,
  onSelectCity,
}) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  if (!showCities) return null;

  const cities = GLOBAL_LOCATIONS.filter((loc) => loc.type === 'city');

  return (
    <group>
      {cities.map((city) => {
        const [x, y, z] = latLonToVector3(city.lat, city.lon, GLOBE_RADIUS + 0.006);
        const isHovered = hoveredCity === city.name;

        return (
          <group key={city.name} position={[x, y, z]}>
            {/* Small glowing green marker dot */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredCity(city.name);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredCity(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCity) onSelectCity(city.lat, city.lon);
              }}
            >
              <sphereGeometry args={[0.016, 12, 12]} />
              <meshBasicMaterial
                color={isHovered ? '#6EE7B7' : '#34D399'}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Hover Tooltip Card */}
            {isHovered && (
              <Html
                position={[0, 0.04, 0]}
                center
                distanceFactor={10}
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-slate-900/90 text-slate-100 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md text-xs whitespace-nowrap z-50">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {city.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {Math.abs(city.lat).toFixed(1)}°{city.lat >= 0 ? 'N' : 'S'}, {Math.abs(city.lon).toFixed(1)}°{city.lon >= 0 ? 'E' : 'W'}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
