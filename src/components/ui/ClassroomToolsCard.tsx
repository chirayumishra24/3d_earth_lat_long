'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Globe2,
  Compass,
  Layers,
  RotateCw,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { HemisphereMode } from '../scene/HemispheresOverlay';
import { soundManager } from '@/lib/audio';

interface ClassroomToolsCardProps {
  hemisphereMode: HemisphereMode;
  setHemisphereMode: (mode: HemisphereMode) => void;
  showDegreeLabels: boolean;
  setShowDegreeLabels: (show: boolean) => void;
  showSpecialParallels: boolean;
  setShowSpecialParallels: (show: boolean) => void;
  onFlyToPreset: (lat: number, lon: number) => void;
}

export const ClassroomToolsCard: React.FC<ClassroomToolsCardProps> = ({
  hemisphereMode,
  setHemisphereMode,
  showDegreeLabels,
  setShowDegreeLabels,
  showSpecialParallels,
  setShowSpecialParallels,
  onFlyToPreset,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 p-4 rounded-3xl shadow-2xl w-full max-w-[340px] text-slate-100 flex flex-col gap-3 select-none">
      {/* HEADER */}
      <button
        onClick={() => {
          soundManager.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Classroom Teaching Tools
            </h3>
            <span className="text-[10px] text-slate-400">
              Hemispheres, Presets & Graticule Labels
            </span>
          </div>
        </div>
        <div className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* EXPANDED TEACHING TOOLKIT */}
      {isOpen && (
        <div className="flex flex-col gap-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
          {/* 1. HEMISPHERE HIGHLIGHT TOGGLES */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              🌍 Highlight Hemispheres:
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setHemisphereMode('none');
                }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border transition-all ${
                  hemisphereMode === 'none'
                    ? 'bg-slate-700 border-white/30 text-white'
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                Off
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setHemisphereMode('north_south');
                }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border transition-all ${
                  hemisphereMode === 'north_south'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                North / South
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setHemisphereMode('east_west');
                }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border transition-all ${
                  hemisphereMode === 'east_west'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                East / West
              </button>
            </div>
          </div>

          {/* 2. DEGREE LABELS & SPECIAL PARALLELS TOGGLES */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowDegreeLabels(!showDegreeLabels);
              }}
              className={`py-1.5 px-2.5 rounded-xl text-[10px] font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                showDegreeLabels
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Degree Tags</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowSpecialParallels(!showSpecialParallels);
              }}
              className={`py-1.5 px-2.5 rounded-xl text-[10px] font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                showSpecialParallels
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Tropics & Poles</span>
            </button>
          </div>

          {/* 3. QUICK VIEWPOINT FLY-TO PRESETS */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              🔭 Key Lesson Viewpoints:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { name: 'Equator 0°', lat: 0, lon: 0 },
                { name: 'North Pole', lat: 88, lon: 0 },
                { name: 'South Pole', lat: -88, lon: 0 },
                { name: 'Greenwich', lat: 51.5, lon: 0 },
                { name: 'India (Cancer)', lat: 23.5, lon: 78 },
                { name: 'Americas', lat: 10, lon: -75 },
              ].map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    soundManager.playPinDrop();
                    onFlyToPreset(p.lat, p.lon);
                  }}
                  className="py-1.5 px-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/5 text-[10px] text-slate-300 hover:text-amber-300 font-semibold transition-colors truncate"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
