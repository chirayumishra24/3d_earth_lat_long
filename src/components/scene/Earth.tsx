'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { GLOBE_RADIUS, vector3ToLatLon } from '@/lib/geo';
import { AtmosphereShaderMaterial } from './AtmosphereShader';

interface EarthProps {
  onEarthClick: (lat: number, lon: number) => void;
  showClouds?: boolean;
  showAtmosphere?: boolean;
}

export const Earth: React.FC<EarthProps> = ({
  onEarthClick,
  showClouds = true,
  showAtmosphere = true,
}) => {
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh>(null);

  // Track pointer down vs up distance to distinguish single click from drag/turn
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load high-res NASA textures synchronously with R3F suspense
  const [dayMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/textures/earth_day.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
  ]);

  dayMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;
  dayMap.wrapS = THREE.ClampToEdgeWrapping;
  dayMap.wrapT = THREE.ClampToEdgeWrapping;

  // Frame loop for clouds rotation
  useFrame((_, delta) => {
    if (cloudsMeshRef.current && showClouds) {
      cloudsMeshRef.current.rotation.y += delta * 0.015;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  // Only trigger click to drop pin if user didn't drag the globe to turn it
  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    const dist = Math.hypot(
      e.clientX - pointerDownPos.current.x,
      e.clientY - pointerDownPos.current.y
    );
    // If movement is less than 6px, it was an intentional tap/click to drop pin
    if (dist < 6 && e.point && e.object) {
      const localPoint = e.object.worldToLocal(e.point.clone());
      const { lat, lon } = vector3ToLatLon(localPoint.x, localPoint.y, localPoint.z);
      onEarthClick(lat, lon);
    }
  };

  // Custom Atmosphere Shader Material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#38BDF8') },
        coef: { value: 0.65 },
        power: { value: 3.8 },
      },
      vertexShader: AtmosphereShaderMaterial.vertexShader,
      fragmentShader: AtmosphereShaderMaterial.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <group>
      {/* 1. REALISTIC NASA EARTH SURFACE */}
      <mesh
        ref={earthMeshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* 2. REAL DYNAMIC CLOUD LAYER */}
      {showClouds && (
        <mesh ref={cloudsMeshRef}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.02, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent
            opacity={0.45}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. ATMOSPHERIC FRESNEL GLOW (CYAN RIM) */}
      {showAtmosphere && (
        <mesh ref={atmosphereMeshRef} material={atmosphereMaterial}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.12, 64, 64]} />
        </mesh>
      )}
    </group>
  );
};
