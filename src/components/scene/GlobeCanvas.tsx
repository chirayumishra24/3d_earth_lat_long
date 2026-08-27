'use client';

import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Earth } from './Earth';
import { Graticule } from './Graticule';
import { Marker } from './Marker';
import { ReferenceCities } from './ReferenceCities';
import { HemispheresOverlay, HemisphereMode } from './HemispheresOverlay';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';

interface GlobeCanvasProps {
  markerLat: number;
  markerLon: number;
  onMarkerChange: (lat: number, lon: number) => void;
  showGrid: boolean;
  showEquator: boolean;
  showPrimeMeridian: boolean;
  showCities: boolean;
  showClouds: boolean;
  showDegreeLabels: boolean;
  showSpecialParallels: boolean;
  hemisphereMode: HemisphereMode;
  autoRotate: boolean;
  targetLookAt: { lat: number; lon: number } | null;
  onFlyToComplete: () => void;
  targetLat?: number;
  targetLon?: number;
  isAnswerRevealed?: boolean;
  isSuccess?: boolean;
}

interface GlobeBodyProps {
  markerLat: number;
  markerLon: number;
  onMarkerChange: (lat: number, lon: number) => void;
  showGrid: boolean;
  showEquator: boolean;
  showPrimeMeridian: boolean;
  showCities: boolean;
  showClouds: boolean;
  showDegreeLabels: boolean;
  showSpecialParallels: boolean;
  hemisphereMode: HemisphereMode;
  autoRotate: boolean;
  targetLat?: number;
  targetLon?: number;
  isAnswerRevealed?: boolean;
  isSuccess?: boolean;
}

// Unified rigid body: Earth surface, Graticule grid, Markers, and Cities ALL rotate together
const GlobeBody: React.FC<GlobeBodyProps> = ({
  markerLat,
  markerLon,
  onMarkerChange,
  showGrid,
  showEquator,
  showPrimeMeridian,
  showCities,
  showClouds,
  showDegreeLabels,
  showSpecialParallels,
  hemisphereMode,
  autoRotate,
  targetLat,
  targetLon,
  isAnswerRevealed,
  isSuccess,
}) => {
  const globeGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (globeGroupRef.current && autoRotate) {
      globeGroupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* 1. EARTH SURFACE MESH */}
      <Earth
        onEarthClick={onMarkerChange}
        showClouds={showClouds}
      />

      {/* 2. PROCEDURAL GRATICULE WITH DEGREE TAGS & SPECIAL TROPICS */}
      <Graticule
        showGrid={showGrid}
        showEquator={showEquator}
        showPrimeMeridian={showPrimeMeridian}
        showDegreeLabels={showDegreeLabels}
        showSpecialParallels={showSpecialParallels}
      />

      {/* 3. HEMISPHERES OVERLAY HIGHLIGHTER */}
      <HemispheresOverlay mode={hemisphereMode} />

      {/* 4. STUDENT MARKER PIN & TARGET BEACON */}
      <Marker
        lat={markerLat}
        lon={markerLon}
        targetLat={targetLat}
        targetLon={targetLon}
        isAnswerRevealed={isAnswerRevealed}
        isSuccess={isSuccess}
      />

      {/* 5. REFERENCE GLOBAL CITIES */}
      <ReferenceCities
        showCities={showCities}
        onSelectCity={onMarkerChange}
      />
    </group>
  );
};

export const GlobeCanvas: React.FC<GlobeCanvasProps> = ({
  markerLat,
  markerLon,
  onMarkerChange,
  showGrid,
  showEquator,
  showPrimeMeridian,
  showCities,
  showClouds,
  showDegreeLabels,
  showSpecialParallels,
  hemisphereMode,
  autoRotate,
  targetLookAt,
  onFlyToComplete,
  targetLat,
  targetLon,
  isAnswerRevealed,
  isSuccess,
}) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 1.2, 4.8], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* BALANCED PHOTOREALISTIC LIGHTING */}
        <ambientLight color="#ffffff" intensity={1.1} />
        <directionalLight position={[6, 4, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, -3, -6]} intensity={0.5} color="#bae6fd" />

        <Suspense fallback={null}>
          {/* STARFIELD PARTICLE BACKGROUND */}
          <Starfield />

          {/* UNIFIED EARTH & GRATICULE RIGID BODY */}
          <GlobeBody
            markerLat={markerLat}
            markerLon={markerLon}
            onMarkerChange={onMarkerChange}
            showGrid={showGrid}
            showEquator={showEquator}
            showPrimeMeridian={showPrimeMeridian}
            showCities={showCities}
            showClouds={showClouds}
            showDegreeLabels={showDegreeLabels}
            showSpecialParallels={showSpecialParallels}
            hemisphereMode={hemisphereMode}
            autoRotate={autoRotate}
            targetLat={targetLat}
            targetLon={targetLon}
            isAnswerRevealed={isAnswerRevealed}
            isSuccess={isSuccess}
          />

          {/* CAMERA RIG & SMOOTH ORBIT CONTROLS */}
          <CameraRig
            targetLookAt={targetLookAt}
            onAnimationEnd={onFlyToComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
