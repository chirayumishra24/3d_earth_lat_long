'use client';

import React from 'react';
import {
  Globe2,
  Compass,
  Target,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface WelcomeScreenProps {
  isOpen: boolean;
  onStartTour: () => void;
  onStartExplore: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen,
  onStartTour,
  onStartExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 select-none">
      <div className="bg-slate-900/95 border border-white/15 w-full max-w-2xl rounded-3xl p-6 sm:p-9 shadow-2xl text-slate-100 flex flex-col gap-6 relative overflow-hidden">
        {/* Glow ambient background rings */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* HERO TITLE & BADGE */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/25">
            <Globe2 className="w-9 h-9 text-slate-950 stroke-[2.5]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Interactive Geography Lab
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
            3D Earth Coordinate Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            Master the global coordinate system through interactive 3D Earth exploration.
            Discover how <strong>Latitude</strong> and <strong>Longitude</strong> map every point on our planet.
          </p>
        </div>

        {/* 3 HIGHLIGHT FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Live Coordinate Math</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Drag the marker or tap anywhere to compute exact real-time Latitude and Longitude.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 w-fit">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Graticule Grid Lines</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Overlay 15° parallels, the amber Equator (0°), and cyan Prime Meridian.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Directional Challenges</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Test your skills with directional compass radar without coordinate spoilers.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onStartTour();
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Take Guided Tour (Recommended)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onStartExplore();
            }}
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Jump Right In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
