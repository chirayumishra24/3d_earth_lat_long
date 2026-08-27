'use client';

import React, { useState } from 'react';
import {
  Target,
  Compass,
  Grid,
  Globe,
  MapPin,
  Eye,
  Lightbulb,
  Cloud,
  Rotate3d,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { Challenge } from '@/lib/challenges';
import { FeedbackResult } from '@/lib/feedback';
import { soundManager } from '@/lib/audio';

interface ChallengeCardProps {
  challenge: Challenge;
  feedback: FeedbackResult;
  mode: 'explore' | 'challenge';
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
  attempts: number;
  onRevealAnswer: () => void;
  isAnswerRevealed: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  feedback,
  mode,
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
  attempts,
  onRevealAnswer,
  isAnswerRevealed,
}) => {
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showHintDropdown, setShowHintDropdown] = useState<boolean>(false);
  const [confirmReveal, setConfirmReveal] = useState<boolean>(false);

  const toggleSwitch = (
    current: boolean,
    setter: (val: boolean) => void
  ) => {
    const next = !current;
    setter(next);
    soundManager.playToggle(next);
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl w-full max-w-[380px] text-slate-100 flex flex-col gap-3.5 select-none">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {mode === 'challenge' ? 'Coordinate Challenge' : 'Observatory Controls'}
            </h2>
            <div className="text-[10px] text-slate-400">
              {mode === 'challenge' ? challenge.subtitle : 'Interact with Earth & Graticule'}
            </div>
          </div>
        </div>

        {mode === 'challenge' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-[10px] font-bold text-amber-400">
            <span>Stage {challenge.stage}</span>
          </div>
        )}
      </div>

      {/* CHALLENGE TASK PROMPT */}
      {mode === 'challenge' && (
        <div className="bg-gradient-to-br from-slate-950/80 to-slate-900/90 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1.5">
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            {challenge.title}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {challenge.prompt}
          </p>
        </div>
      )}

      {/* LIVE DIRECTIONAL RADAR & PROXIMITY FEEDBACK (STRICT DIRECTIONAL-ONLY) */}
      {mode === 'challenge' && (
        <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Directional Guidance
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${feedback.tierColor}20`,
                color: feedback.tierColor,
                border: `1px solid ${feedback.tierColor}40`,
              }}
            >
              {feedback.tierBadge}
            </span>
          </div>

          {/* Directional Radar Arrow & Proximity Bar */}
          <div className="flex items-center gap-3 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
            <div className="text-2xl w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              {feedback.directionArrow}
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                <span>Move {feedback.directionLabel}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {feedback.hintMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK TOGGLE PILLS GROUP */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
          <span>Display Graticule & Layers</span>
          <span className="text-[9px] text-slate-400 font-normal">Click to toggle</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* EQUATOR TOGGLE (Amber) */}
          <button
            onClick={() => toggleSwitch(showEquator, setShowEquator)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
              showEquator
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                showEquator ? 'bg-amber-400' : 'bg-slate-600'
              }`}
            ></span>
            <span>Equator (0°)</span>
          </button>

          {/* PRIME MERIDIAN TOGGLE (Cyan) */}
          <button
            onClick={() => toggleSwitch(showPrimeMeridian, setShowPrimeMeridian)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
              showPrimeMeridian
                ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 shadow-md shadow-sky-500/10'
                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                showPrimeMeridian ? 'bg-sky-400' : 'bg-slate-600'
              }`}
            ></span>
            <span>0° Meridian</span>
          </button>

          {/* 15° GRID (Graticule) */}
          <button
            onClick={() => toggleSwitch(showGrid, setShowGrid)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
              showGrid
                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow-md shadow-indigo-500/10'
                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Show Grid</span>
          </button>

          {/* CITIES */}
          <button
            onClick={() => toggleSwitch(showCities, setShowCities)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
              showCities
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Cities</span>
          </button>

          {/* CLOUDS */}
          <button
            onClick={() => toggleSwitch(showClouds, setShowClouds)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
              showClouds
                ? 'bg-slate-700 border-white/20 text-slate-200'
                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3 h-3" />
            <span>Clouds</span>
          </button>

          {/* AUTO-ROTATE */}
          <button
            onClick={() => toggleSwitch(autoRotate, setAutoRotate)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
              autoRotate
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rotate3d className="w-3 h-3" />
            <span>Spin</span>
          </button>
        </div>
      </div>

      {/* ESCALATING HINTS & REVEAL SYSTEM (Challenge Mode Only) */}
      {mode === 'challenge' && (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-2.5">
          {/* Hint Accordion Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHintDropdown(!showHintDropdown)}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>
                Need a hint? (Hint {hintIndex + 1}/{challenge.hints.length})
              </span>
              {showHintDropdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Reveal Answer explicit control */}
            {!isAnswerRevealed ? (
              confirmReveal ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onRevealAnswer();
                      setConfirmReveal(false);
                      soundManager.playClick();
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
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>Reveal Target</span>
                </button>
              )
            ) : (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" />
                Target Highlighted
              </span>
            )}
          </div>

          {/* Hint Content Box */}
          {showHintDropdown && (
            <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20 text-xs text-slate-300 flex flex-col gap-2">
              <p className="italic leading-relaxed">
                "{challenge.hints[hintIndex]}"
              </p>
              {challenge.hints.length > 1 && (
                <div className="flex justify-end gap-1.5 mt-1">
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
      )}

      {/* FOOTER STATS ROW */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5 font-mono">
        <span>Attempts: {attempts}</span>
        <span>Grid Interval: 15°</span>
        <span className="text-emerald-400">Sphere: 3D WGS-84</span>
      </div>
    </div>
  );
};

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
