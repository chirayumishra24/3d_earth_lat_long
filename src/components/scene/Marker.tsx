'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLOBE_RADIUS, latLonToVector3, findNearestLocation } from '@/lib/geo';

interface MarkerProps {
  lat: number;
  lon: number;
  isDragging?: boolean;
  targetLat?: number;
  targetLon?: number;
  isAnswerRevealed?: boolean;
  isSuccess?: boolean;
}

export const Marker: React.FC<MarkerProps> = ({
  lat,
  lon,
  isDragging = false,
  targetLat,
  targetLon,
  isAnswerRevealed = false,
  isSuccess = false,
}) => {
  const markerGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const targetRingRef = useRef<THREE.Mesh>(null);

  const locationInfo = findNearestLocation(lat, lon);

  // Convert current marker Lat/Lon to 3D Cartesian position
  const [x, y, z] = latLonToVector3(lat, lon, GLOBE_RADIUS);
  const position = new THREE.Vector3(x, y, z);
  const normal = position.clone().normalize();

  // Convert revealed target coordinates if present
  const targetPos = targetLat !== undefined && targetLon !== undefined
    ? new THREE.Vector3(...latLonToVector3(targetLat, targetLon, GLOBE_RADIUS))
    : null;
  const targetNormal = targetPos ? targetPos.clone().normalize() : null;

  // Pulse animations on frame update
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Pulse student marker ground ring
    if (ringRef.current) {
      const scale = 1 + Math.sin(time * 5) * 0.25;
      ringRef.current.scale.set(scale, scale, scale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.5 + Math.cos(time * 5) * 0.3;
      }
    }

    // Pulse revealed target ring
    if (targetRingRef.current) {
      const tScale = 1 + Math.sin(time * 4) * 0.2;
      targetRingRef.current.scale.set(tScale, tScale, tScale);
    }
  });

  // Calculate orientation quaternion so pin sticks outward radially from Earth's center
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  const targetQuaternion = new THREE.Quaternion();
  if (targetNormal) {
    targetQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetNormal);
  }

  const primaryColor = isSuccess ? '#34D399' : isDragging ? '#FBBF24' : '#F59E0B';
  const glowColor = isSuccess ? '#10B981' : '#F59E0B';

  return (
    <group>
      {/* STUDENT ACTIVE MARKER */}
      <group
        ref={markerGroupRef}
        position={[x, y, z]}
        quaternion={quaternion}
      >
        {/* Ground Pulsing Concentric Ripple */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[0.04, 0.07, 32]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Inner Solid Ground Dot */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <circleGeometry args={[0.025, 24]} />
          <meshBasicMaterial color={primaryColor} side={THREE.DoubleSide} />
        </mesh>

        {/* Vertical Beacon Pin Stem */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.006, 0.002, 0.18, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.2}
            metalness={0.8}
            emissive={primaryColor}
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Glowing Head Pin Sphere */}
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.038, 24, 24]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>

        {/* Soft Glowing Atmosphere Halo around marker head */}
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Floating 3D Location Tooltip */}
        <Html
          position={[0, 0.28, 0]}
          center
          distanceFactor={14}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-slate-100 px-2.5 py-1 rounded-xl text-[10px] font-mono shadow-2xl flex flex-col items-center whitespace-nowrap pointer-events-none transition-all duration-200">
            <span className="font-bold text-amber-300">
              {Math.abs(lat).toFixed(2)}°{lat >= 0 ? 'N' : 'S'}, {Math.abs(lon).toFixed(2)}°{lon >= 0 ? 'E' : 'W'}
            </span>
            <span className="text-[9px] text-cyan-300 font-sans font-semibold">
              {locationInfo.displayText}
            </span>
          </div>
        </Html>
      </group>

      {/* REVEALED TARGET MARKER (Green Beacon, only when answer is explicitly revealed or completed) */}
      {isAnswerRevealed && targetPos && targetQuaternion && (
        <group position={targetPos} quaternion={targetQuaternion}>
          {/* Target Ground Ring */}
          <mesh ref={targetRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <ringGeometry args={[0.05, 0.09, 32]} />
            <meshBasicMaterial
              color="#34D399"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Target Flag / Beacon Needle */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.2, 16]} />
            <meshStandardMaterial color="#34D399" emissive="#34D399" emissiveIntensity={0.8} />
          </mesh>

          {/* Target Diamond Top */}
          <mesh position={[0, 0.21, 0]} rotation={[0, Math.PI / 4, 0]}>
            <octahedronGeometry args={[0.035, 0]} />
            <meshStandardMaterial color="#34D399" emissive="#10B981" emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}
    </group>
  );
};
