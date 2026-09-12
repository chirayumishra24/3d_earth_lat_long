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
  sunPosition?: [number, number, number];
}

export const Earth: React.FC<EarthProps> = ({
  onEarthClick,
  showClouds = true,
  showAtmosphere = true,
  sunPosition = [10, 3, 7],
}) => {
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh>(null);

  // Track pointer down vs up distance to distinguish single click from drag/turn
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load high-res NASA textures synchronously with R3F suspense
  const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/textures/earth_day.jpg',
    '/textures/earth_night.png',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
  ]);

  dayMap.colorSpace = THREE.SRGBColorSpace;
  nightMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;
  dayMap.wrapS = THREE.ClampToEdgeWrapping;
  dayMap.wrapT = THREE.ClampToEdgeWrapping;
  nightMap.wrapS = THREE.ClampToEdgeWrapping;
  nightMap.wrapT = THREE.ClampToEdgeWrapping;

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

  // Normalized sun direction vector in world space
  const sunDirVector = useMemo(() => {
    return new THREE.Vector3(...sunPosition).normalize();
  }, [sunPosition]);

  // Photorealistic Day/Night Earth Shader Material
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        normalMap: { value: normalMap },
        specularMap: { value: specularMap },
        sunDirection: { value: sunDirVector },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D nightMap;
        uniform sampler2D normalMap;
        uniform sampler2D specularMap;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        void main() {
          vec3 sunDir = normalize(sunDirection);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Normal mapping perturbation
          vec3 normalTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
          vec3 N = normalize(vWorldNormal + normalTex * 0.35);

          // Calculate sun angle
          float NdotL = dot(N, sunDir);

          // Smooth day/night transition across the terminator
          float dayFactor = smoothstep(-0.12, 0.18, NdotL);

          vec4 dayColor = texture2D(dayMap, vUv);
          vec4 nightColor = texture2D(nightMap, vUv);
          vec4 specTex = texture2D(specularMap, vUv);

          // Specular ocean reflection on daytime side
          vec3 halfVector = normalize(sunDir + viewDir);
          float specAngle = max(dot(N, halfVector), 0.0);
          float specFactor = pow(specAngle, 32.0);
          vec3 oceanSpec = vec3(1.0, 0.95, 0.85) * specFactor * specTex.r * dayFactor * 1.2;

          // Warm twilight / sunset amber glow along the terminator line
          float twilightFactor = smoothstep(-0.20, 0.0, NdotL) * (1.0 - smoothstep(0.0, 0.20, NdotL));
          vec3 twilightColor = vec3(1.0, 0.42, 0.15) * twilightFactor * 0.45;

          // Night city lights (homes, towns, cities glowing warmly in the dark)
          float nightIntensity = 1.0 - dayFactor;
          vec3 cityLights = nightColor.rgb * vec3(1.2, 1.05, 0.8) * nightIntensity * 2.5;

          // Daytime diffuse lighting
          vec3 dayLit = dayColor.rgb * (max(NdotL, 0.0) * 0.94 + 0.06);

          // Composite final Earth surface color
          vec3 finalColor = mix(dayLit, dayColor.rgb * 0.03, 1.0 - dayFactor)
                          + cityLights
                          + oceanSpec
                          + twilightColor;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [dayMap, nightMap, normalMap, specularMap, sunDirVector]);

  // Sun-responsive dynamic cloud layer
  const cloudsMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        cloudsMap: { value: cloudsMap },
        sunDirection: { value: sunDirVector },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;

        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D cloudsMap;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vWorldNormal;

        void main() {
          vec4 cloudTex = texture2D(cloudsMap, vUv);
          float NdotL = dot(vWorldNormal, normalize(sunDirection));
          float cloudDayFactor = smoothstep(-0.15, 0.20, NdotL);
          // Day clouds are white, night clouds are dark silhouettes softly obscuring city lights
          vec3 cloudColor = mix(vec3(0.03, 0.04, 0.08), vec3(1.0, 1.0, 1.0), cloudDayFactor);
          gl_FragColor = vec4(cloudColor, cloudTex.r * 0.45);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, [cloudsMap, sunDirVector]);

  // Custom Atmosphere Shader Material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#38BDF8') },
        sunDirection: { value: sunDirVector },
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
  }, [sunDirVector]);

  return (
    <group>
      {/* 1. REALISTIC DAY/NIGHT NASA EARTH SURFACE */}
      <mesh
        ref={earthMeshRef}
        material={earthMaterial}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      </mesh>

      {/* 2. REAL DYNAMIC CLOUD LAYER (SHADED BY SUN) */}
      {showClouds && (
        <mesh ref={cloudsMeshRef} material={cloudsMaterial}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.02, 64, 64]} />
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
