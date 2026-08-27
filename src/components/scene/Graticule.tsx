'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { GLOBE_RADIUS, latLonToVector3 } from '@/lib/geo';

interface GraticuleProps {
  showGrid: boolean;
  showEquator: boolean;
  showPrimeMeridian: boolean;
  showSpecialParallels?: boolean;
  showDegreeLabels?: boolean;
}

export const Graticule: React.FC<GraticuleProps> = ({
  showGrid,
  showEquator,
  showPrimeMeridian,
  showSpecialParallels = true,
  showDegreeLabels = true,
}) => {
  const r = GLOBE_RADIUS + 0.005;

  // 1. Generate 15° Graticule Grid Lines (Parallels & Meridians)
  const { parallelLines, meridianLines, parallelLabels, meridianLabels } = useMemo(() => {
    const parallels: THREE.Vector3[][] = [];
    const meridians: THREE.Vector3[][] = [];
    const pLabels: { lat: number; pos: THREE.Vector3; text: string }[] = [];
    const mLabels: { lon: number; pos: THREE.Vector3; text: string }[] = [];

    // Latitude Parallels every 30° for clean readability
    for (let lat = -60; lat <= 60; lat += 30) {
      if (lat === 0) continue;
      const [lx, ly, lz] = latLonToVector3(lat, 0, r + 0.012);
      pLabels.push({
        lat,
        pos: new THREE.Vector3(lx, ly, lz),
        text: `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`,
      });
    }

    // Longitude Meridians every 45° along the equator
    for (let lon = -135; lon <= 135; lon += 45) {
      if (lon === 0) continue;
      const [mlx, mly, mlz] = latLonToVector3(0, lon, r + 0.012);
      mLabels.push({
        lon,
        pos: new THREE.Vector3(mlx, mly, mlz),
        text: `${Math.abs(lon)}°${lon > 0 ? 'E' : 'W'}`,
      });
    }

    return {
      parallelLines: parallels,
      meridianLines: meridians,
      parallelLabels: pLabels,
      meridianLabels: mLabels,
    };
  }, [r]);

  // 2. Generate Equator (0° Lat)
  const equatorPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 2) {
      const [x, y, z] = latLonToVector3(0, lon, r + 0.003);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [r]);

  // 3. Generate Prime Meridian (0° Lon)
  const primeMeridianPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let lat = -89; lat <= 89; lat += 2) {
      const [x, y, z] = latLonToVector3(lat, 0, r + 0.003);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [r]);

  // 4. Special Classroom Parallels (Tropics & Polar Circles)
  const { cancerPoints, capricornPoints, arcticPoints, antarcticPoints } = useMemo(() => {
    const cancer: THREE.Vector3[] = [];
    const capricorn: THREE.Vector3[] = [];
    const arctic: THREE.Vector3[] = [];
    const antarctic: THREE.Vector3[] = [];

    for (let lon = -180; lon <= 180; lon += 3) {
      cancer.push(new THREE.Vector3(...latLonToVector3(23.44, lon, r + 0.002)));
      capricorn.push(new THREE.Vector3(...latLonToVector3(-23.44, lon, r + 0.002)));
      arctic.push(new THREE.Vector3(...latLonToVector3(66.56, lon, r + 0.002)));
      antarctic.push(new THREE.Vector3(...latLonToVector3(-66.56, lon, r + 0.002)));
    }

    return {
      cancerPoints: cancer,
      capricornPoints: capricorn,
      arcticPoints: arctic,
      antarcticPoints: antarctic,
    };
  }, [r]);

  return (
    <group>
      {/* 15° LATITUDE / LONGITUDE GRID */}
      {showGrid && (
        <group>
          {parallelLines.map((pts, idx) => (
            <line key={`parallel-${idx}`}>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  count={pts.length}
                  array={new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]))}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                attach="material"
                color="#94A3B8"
                transparent
                opacity={0.25}
                depthWrite={false}
              />
            </line>
          ))}

          {meridianLines.map((pts, idx) => (
            <line key={`meridian-${idx}`}>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  count={pts.length}
                  array={new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]))}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                attach="material"
                color="#94A3B8"
                transparent
                opacity={0.25}
                depthWrite={false}
              />
            </line>
          ))}

          {/* DEGREE LABELS FOR CLASSROOM LEARNING */}
          {showDegreeLabels && (
            <group>
              {parallelLabels.map((lbl) => (
                <Html
                  key={`plabel-${lbl.lat}`}
                  position={[lbl.pos.x, lbl.pos.y, lbl.pos.z]}
                  center
                  distanceFactor={16}
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="bg-slate-950/85 text-amber-300 border border-amber-500/30 px-1 py-0.5 rounded text-[8px] font-mono font-bold shadow-md whitespace-nowrap">
                    {lbl.text}
                  </div>
                </Html>
              ))}

              {meridianLabels.map((lbl) => (
                <Html
                  key={`mlabel-${lbl.lon}`}
                  position={[lbl.pos.x, lbl.pos.y, lbl.pos.z]}
                  center
                  distanceFactor={16}
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="bg-slate-950/85 text-cyan-300 border border-cyan-500/30 px-1 py-0.5 rounded text-[8px] font-mono font-bold shadow-md whitespace-nowrap">
                    {lbl.text}
                  </div>
                </Html>
              ))}
            </group>
          )}
        </group>
      )}

      {/* EQUATOR (0° LATITUDE - AMBER ACCENT) */}
      {showEquator && (
        <group>
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={equatorPoints.length}
                array={new Float32Array(equatorPoints.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              attach="material"
              color="#F59E0B"
              linewidth={3}
              transparent
              opacity={0.95}
              depthWrite={false}
            />
          </line>
          <Html
            position={[0, 0.05, GLOBE_RADIUS + 0.05]}
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
              Equator 0°
            </div>
          </Html>
        </group>
      )}

      {/* PRIME MERIDIAN (0° LONGITUDE - CYAN ACCENT) */}
      {showPrimeMeridian && (
        <group>
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={primeMeridianPoints.length}
                array={new Float32Array(primeMeridianPoints.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              attach="material"
              color="#38BDF8"
              linewidth={3}
              transparent
              opacity={0.95}
              depthWrite={false}
            />
          </line>
          <Html
            position={[0, GLOBE_RADIUS + 0.05, 0.05]}
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-cyan-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
              Prime Meridian 0°
            </div>
          </Html>
        </group>
      )}

      {/* SPECIAL CHAPTER PARALLELS: TROPICS & POLAR CIRCLES */}
      {showSpecialParallels && showGrid && (
        <group>
          {/* Tropic of Cancer (23.5° N) */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={cancerPoints.length}
                array={new Float32Array(cancerPoints.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#FBBF24" transparent opacity={0.6} />
          </line>

          {/* Tropic of Capricorn (23.5° S) */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={capricornPoints.length}
                array={new Float32Array(capricornPoints.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#FBBF24" transparent opacity={0.6} />
          </line>

          {/* Arctic Circle (66.5° N) */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={arcticPoints.length}
                array={new Float32Array(arcticPoints.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#93C5FD" transparent opacity={0.6} />
          </line>

          {/* Antarctic Circle (66.5° S) */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={antarcticPoints.length}
                array={new Float32Array(antarcticPoints.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#93C5FD" transparent opacity={0.6} />
          </line>
        </group>
      )}
    </group>
  );
};
