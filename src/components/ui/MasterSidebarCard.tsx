'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Target,
  GraduationCap,
  MapPin,
  Sliders,
  Sparkles,
  CheckCircle2,
  Crosshair,
  Lightbulb,
  Eye,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { formatCoordinates, findNearestLocation } from '@/lib/geo';
import { Challenge } from '@/lib/challenges';
import { FeedbackResult } from '@/lib/feedback';
import { HemisphereMode } from '../scene/HemispheresOverlay';
import { soundManager } from '@/lib/audio';

interface MasterSidebarCardProps {
  lat: number;
  lon: number;
  onCoordinateChange: (lat: number, lon: number) => void;
  mode: 'explore' | 'challenge';
  setMode: (mode: 'explore' | 'challenge') => void;
  challenge: Challenge;
  feedback: FeedbackResult;
  challengeIndex: number;
  totalChallenges: number;
  attempts: number;
  onCheckAnswer: () => void;
  onCenterCamera: () => void;
  onOpenJumpModal: () => void;
  onRevealAnswer: () => void;
  isAnswerRevealed: boolean;
  // Classroom teaching props
  hemisphereMode: HemisphereMode;
  setHemisphereMode: (mode: HemisphereMode) => void;
  showDegreeLabels: boolean;
  setShowDegreeLabels: (show: boolean) => void;
  showSpecialParallels: boolean;
  setShowSpecialParallels: (show: boolean) => void;
  onFlyToPreset: (lat: number, lon: number) => void;
}

export const MasterSidebarCard: React.FC<MasterSidebarCardProps> = ({
  lat,
  lon,
  onCoordinateChange,
  mode,
  setMode,
  challenge,
  feedback,
  challengeIndex,
  totalChallenges,
  attempts,
  onCheckAnswer,
  onCenterCamera,
  onOpenJumpModal,
  onRevealAnswer,
  isAnswerRevealed,
  hemisphereMode,
  setHemisphereMode,
  showDegreeLabels,
  setShowDegreeLabels,
  showSpecialParallels,
  setShowSpecialParallels,
  onFlyToPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'readout' | 'challenge' | 'teacher'>(
    mode === 'challenge' ? 'challenge' : 'readout'
  );
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showHintDropdown, setShowHintDropdown] = useState<boolean>(false);
  const [confirmReveal, setConfirmReveal] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'challenge') {
      setActiveTab('challenge');
    } else if (activeTab === 'challenge') {
      setActiveTab('readout');
    }
  }, [mode]);

  const { latValue, latDir, lonValue, lonDir } = formatCoordinates(lat, lon);
  const { displayText, category, distanceKm } = findNearestLocation(lat, lon);

  const handleLatSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCoordinateChange(parseFloat(e.target.value), lon);
  };

  const handleLonSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCoordinateChange(lat, parseFloat(e.target.value));
  };

  return (
    <aside className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-4 sm:p-5 rounded-3xl shadow-2xl w-full max-w-[350px] text-slate-100 flex flex-col gap-3.5 select-none max-h-[82vh] overflow-y-auto">
      {/* 1. TOP TAB SWITCHER */}
      <div className="grid grid-cols-3 gap-1 bg-slate-950/70 p-1 rounded-2xl border border-white/5">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('readout');
            if (mode === 'challenge') setMode('explore');
          }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'readout'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Coords</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('challenge');
            if (mode === 'explore') setMode('challenge');
          }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'challenge'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Mission</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('teacher');
            if (mode === 'challenge') setMode('explore');
          }}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'teacher'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Teach</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COORDINATES & LIVE READOUT */}
      {/* ========================================================================= */}
      {activeTab === 'readout' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Live Coordinate Instrument
              </span>
            </div>
            <button
              onClick={onOpenJumpModal}
              className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-white/5"
            >
              <Sliders className="w-3 h-3" />
              <span>Jump</span>
            </button>
          </div>

          {/* Large Numerals */}
          <div className="grid grid-cols-2 gap-2.5 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Latitude [-90°..90°]
              </div>
              <div className="mt-1 flex items-baseline gap-1 font-mono">
                <span className="text-xl font-bold text-slate-50">{latValue}°</span>
                <span className={`text-sm font-bold ${latDir === 'N' ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {latDir}
                </span>
              </div>
              <span className="text-[9px] text-slate-400">
                {lat >= 0 ? 'North of Equator' : 'South of Equator'}
              </span>
            </div>

            <div className="border-l border-white/10 pl-2.5">
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Longitude [-180°..180°]
              </div>
              <div className="mt-1 flex items-baseline gap-1 font-mono">
                <span className="text-xl font-bold text-slate-50">{lonValue}°</span>
                <span className={`text-sm font-bold ${lonDir === 'E' ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {lonDir}
                </span>
              </div>
              <span className="text-[9px] text-slate-400">
                {lon >= 0 ? 'East of Meridian' : 'West of Meridian'}
              </span>
            </div>
          </div>

          {/* Exact Clicked Location Indicator */}
          <div className="flex items-center gap-2.5 bg-cyan-500/10 px-3 py-2 rounded-xl border border-cyan-500/30 text-xs text-slate-200 shadow-sm">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate flex-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                {category === 'ocean' || category === 'sea' ? 'Water Body' : 'Location / Country'}:
              </span>
              <span className="font-bold text-slate-100 text-xs sm:text-sm">
                {displayText}
              </span>
            </div>
          </div>

          {/* Interactive Dual Sliders */}
          <div className="flex flex-col gap-2 bg-slate-950/40 p-2.5 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>90°S</span>
                <span className="text-amber-400 font-semibold">Lat: {latValue}° {latDir}</span>
                <span>90°N</span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                step="0.1"
                value={lat}
                onChange={handleLatSlider}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>180°W</span>
                <span className="text-cyan-400 font-semibold">Lon: {lonValue}° {lonDir}</span>
                <span>180°E</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="0.1"
                value={lon}
                onChange={handleLonSlider}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                soundManager.playPinDrop();
                onCenterCamera();
              }}
              className="flex-1 py-2 px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Center Pin</span>
            </button>
            <button
              onClick={onOpenJumpModal}
              className="py-2 px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Type Coords</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHALLENGE MISSIONS & DIRECTIONAL RADAR */}
      {/* ========================================================================= */}
      {activeTab === 'challenge' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Stage {challenge.stage} · Mission {challengeIndex + 1}/{totalChallenges}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Attempts: {attempts}
            </span>
          </div>

          {/* Mission Prompt Box */}
          <div className="bg-gradient-to-br from-slate-950/80 to-slate-900/90 p-3 rounded-2xl border border-white/10 flex flex-col gap-1">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              {challenge.title}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {challenge.prompt}
            </p>
          </div>

          {/* Directional Radar */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                Directional Radar
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${feedback.tierColor}20`,
                  color: feedback.tierColor,
                  border: `1px solid ${feedback.tierColor}40`,
                }}
              >
                {feedback.tierBadge}
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/[0.03] p-2 rounded-xl border border-white/5">
              <div className="text-xl w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                {feedback.directionArrow}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-100">
                  Move {feedback.directionLabel}
                </div>
                <p className="text-[10px] text-slate-300 leading-snug">
                  {feedback.hintMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Check Answer Main Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onCheckAnswer();
            }}
            className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Check My Answer</span>
          </button>

          {/* Hints & Reveal Dropdown */}
          <div className="flex flex-col gap-1.5 border-t border-white/10 pt-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowHintDropdown(!showHintDropdown)}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Lightbulb className="w-3 h-3" />
                <span>Hint ({hintIndex + 1}/{challenge.hints.length})</span>
                {showHintDropdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isAnswerRevealed ? (
                confirmReveal ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onRevealAnswer();
                        setConfirmReveal(false);
                      }}
                      className="text-[10px] text-rose-400 font-bold hover:underline"
                    >
                      Confirm Reveal
                    </button>
                    <button
                      onClick={() => setConfirmReveal(false)}
                      className="text-[10px] text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReveal(true)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Reveal Target</span>
                  </button>
                )
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  Target Shown
                </span>
              )}
            </div>

            {showHintDropdown && (
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-500/20 text-[11px] text-slate-300 flex flex-col gap-1.5">
                <p className="italic leading-relaxed">
                  "{challenge.hints[hintIndex]}"
                </p>
                {challenge.hints.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setHintIndex((prev) => (prev + 1) % challenge.hints.length)}
                      className="text-[10px] text-amber-400 hover:underline font-semibold"
                    >
                      Next Hint →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEACHER & CLASSROOM TOOLS */}
      {/* ========================================================================= */}
      {activeTab === 'teacher' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-150">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Classroom Teaching Tools
            </span>
          </div>

          {/* Hemisphere Highlights */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
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

          {/* Graticule Annotations */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowDegreeLabels(!showDegreeLabels);
              }}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border flex items-center justify-center gap-1 transition-all ${
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
              className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                showSpecialParallels
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Tropics & Poles</span>
            </button>
          </div>

          {/* Key Lesson Viewpoints */}
          <div className="flex flex-col gap-1 pt-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              🔭 Key Lesson Viewpoints:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { name: 'Equator 0°', lat: 0, lon: 0 },
                { name: 'North Pole', lat: 88, lon: 0 },
                { name: 'South Pole', lat: -88, lon: 0 },
                { name: 'Greenwich 0°', lat: 51.5, lon: 0 },
                { name: 'Tropic Cancer', lat: 23.5, lon: 78 },
                { name: 'Americas', lat: 10, lon: -75 },
              ].map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    soundManager.playPinDrop();
                    onFlyToPreset(p.lat, p.lon);
                  }}
                  className="py-1.5 px-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/5 text-[9px] text-slate-300 hover:text-amber-300 font-semibold transition-colors truncate"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
