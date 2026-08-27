'use client';

import React from 'react';
import {
  Grid,
  MapPin,
  Cloud,
  Rotate3d,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface BottomControlPillsProps {
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showEquator: boolean;
  setShowEquator: (show: boolean) => void;
  showPrimeMeridian: boolean;
  setShowPrimeMeridian: (show: boolean) => void;
  showCities: boolean;
  setShowCities: (show: boolean) => void;
  showClouds: boolean;
  setShowClouds: (show: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
}

export const BottomControlPills: React.FC<BottomControlPillsProps> = ({
  showGrid,
  setShowGrid,
  showEquator,
  setShowEquator,
  showPrimeMeridian,
  setShowPrimeMeridian,
  showCities,
  setShowCities,
  showClouds,
  setShowClouds,
  autoRotate,
  setAutoRotate,
}) => {
  const toggle = (current: boolean, setter: (val: boolean) => void) => {
    const next = !current;
    setter(next);
    soundManager.playToggle(next);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-x-auto max-w-[95vw] select-none">
      {/* 1. EQUATOR (Amber) */}
      <button
        onClick={() => toggle(showEquator, setShowEquator)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          showEquator
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            showEquator ? 'bg-slate-950' : 'bg-amber-400'
          }`}
        />
        <span>Equator (0°)</span>
      </button>

      {/* 2. PRIME MERIDIAN (Cyan) */}
      <button
        onClick={() => toggle(showPrimeMeridian, setShowPrimeMeridian)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          showPrimeMeridian
            ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            showPrimeMeridian ? 'bg-slate-950' : 'bg-sky-400'
          }`}
        />
        <span>0° Meridian</span>
      </button>

      {/* 3. SHOW 15° GRID */}
      <button
        onClick={() => toggle(showGrid, setShowGrid)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          showGrid
            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <Grid className="w-3.5 h-3.5" />
        <span>15° Grid</span>
      </button>

      {/* 4. CITIES */}
      <button
        onClick={() => toggle(showCities, setShowCities)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          showCities
            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>Cities</span>
      </button>

      {/* 5. CLOUDS */}
      <button
        onClick={() => toggle(showClouds, setShowClouds)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          showClouds
            ? 'bg-slate-700 text-slate-100 shadow-md'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <Cloud className="w-3.5 h-3.5" />
        <span>Clouds</span>
      </button>

      {/* 6. AUTO-SPIN */}
      <button
        onClick={() => toggle(autoRotate, setAutoRotate)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          autoRotate
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <Rotate3d className="w-3.5 h-3.5" />
        <span>Auto-Spin</span>
      </button>
    </div>
  );
};
