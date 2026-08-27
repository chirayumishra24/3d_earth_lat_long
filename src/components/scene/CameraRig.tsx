'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { latLonToVector3 } from '@/lib/geo';

interface CameraRigProps {
  targetLookAt?: { lat: number; lon: number } | null;
  onAnimationEnd?: () => void;
  isDraggingMarker?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  targetLookAt,
  onAnimationEnd,
  isDraggingMarker = false,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const animationState = useRef<{
    isAnimating: boolean;
    startTime: number;
    duration: number;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
  }>({
    isAnimating: false,
    startTime: 0,
    duration: 1200,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
  });

  // Trigger fly-to animation when targetLookAt updates
  useEffect(() => {
    if (!targetLookAt) return;

    const [tx, ty, tz] = latLonToVector3(targetLookAt.lat, targetLookAt.lon, 1.0);
    const targetDir = new THREE.Vector3(tx, ty, tz).normalize();

    // Preserve current camera distance
    const currentDist = camera.position.length() || 5.0;
    const endCameraPos = targetDir.clone().multiplyScalar(Math.max(3.6, Math.min(6.5, currentDist)));

    animationState.current = {
      isAnimating: true,
      startTime: performance.now(),
      duration: 1200,
      startPos: camera.position.clone(),
      endPos: endCameraPos,
    };
  }, [targetLookAt, camera]);

  // Frame update for smooth camera fly-to interpolation
  useFrame(() => {
    if (!animationState.current.isAnimating) return;

    const now = performance.now();
    const elapsed = now - animationState.current.startTime;
    const progress = Math.min(1, elapsed / animationState.current.duration);

    // Cubic ease-in-out
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    camera.position.lerpVectors(
      animationState.current.startPos,
      animationState.current.endPos,
      ease
    );
    camera.lookAt(0, 0, 0);

    if (controlsRef.current) {
      controlsRef.current.update();
    }

    if (progress >= 1) {
      animationState.current.isAnimating = false;
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={0.9}
      minDistance={2.4}
      maxDistance={8.0}
      enablePan={false}
      enabled={!isDraggingMarker && !animationState.current.isAnimating}
    />
  );
};
