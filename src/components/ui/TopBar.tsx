'use client';

import React from 'react';
import {
  Globe2,
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  Navigation2,
  Compass,
  BookOpen,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface TopBarProps {
  mode: 'explore' | 'challenge';
  setMode: (mode: 'explore' | 'challenge') => void;
  score: number;
  streak: number;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onResetCamera: () => void;
  onOpenHelp: () => void;
  onOpenTour: () => void;
  onOpenVisualGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  setMode,
  score,
  streak,
  isMuted,
  setIsMuted,
  onResetCamera,
  onOpenHelp,
  onOpenTour,
  onOpenVisualGuide,
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) soundManager.playClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 px-4 sm:px-6 bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between shadow-2xl">
      {/* LEFT: Branding & Topic info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
          <Globe2 className="w-4.5 h-4.5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5 leading-none">
            <span>Chapter 4</span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span className="text-slate-400">Geography Lab</span>
          </div>
          <h1 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight leading-tight mt-0.5">
            3D Earth Coordinate Explorer
          </h1>
        </div>
      </div>

      {/* CENTER: Mode Switcher (Explore ⇄ Challenge) */}
      <div className="bg-slate-900/90 border border-white/10 p-1 rounded-full shadow-lg flex items-center gap-1">
        <button
          onClick={() => {
            soundManager.playClick();
            setMode('explore');
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            mode === 'explore'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Mode</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setMode('challenge');
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            mode === 'challenge'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Navigation2 className="w-3.5 h-3.5" />
          <span>Challenge Mode</span>
        </button>
      </div>

      {/* RIGHT: Stats & Control actions */}
      <div className="flex items-center gap-2">
        {mode === 'challenge' && (
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/85 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{score} PTS</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{streak}x Streak</span>
              </div>
            )}
          </div>
        )}

        {/* Reset Camera Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onResetCamera();
          }}
          title="Reset Camera View"
          className="p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          className="p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Illustrated Guide Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenVisualGuide();
          }}
          title="Illustrated Visual Chapter Guide"
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-colors shadow-lg"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Illustrated Guide</span>
        </button>

        {/* Guided Tour Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenTour();
          }}
          title="Interactive Feature Tour"
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Tour</span>
        </button>

        {/* Help Guide Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenHelp();
          }}
          title="Latitude & Longitude Guide"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">How It Works</span>
        </button>
      </div>
    </header>
  );
};
