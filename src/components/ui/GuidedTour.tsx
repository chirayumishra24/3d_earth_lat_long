'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Globe2,
  Sliders,
  Target,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  MapPin,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

export interface TourStep {
  id: string;
  title: string;
  badge: string;
  description: string;
  highlightSelector?: string;
  icon: React.ReactNode;
  position: 'center' | 'top-left' | 'bottom-left' | 'top-center' | 'top-right';
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'globe',
    title: '1. Interactive 3D Earth',
    badge: '3D WebGL Globe',
    description: 'Click and drag anywhere in space or on Earth to freely rotate the globe. Scroll to zoom in and out. Tap on any landmass or ocean to drop your student marker pin.',
    icon: <Globe2 className="w-5 h-5 text-amber-400" />,
    position: 'center',
  },
  {
    id: 'readout',
    title: '2. Live Coordinate Readout',
    badge: 'Instrument Panel',
    description: 'Displays real-time Latitude (°N / °S from the Equator) and Longitude (°E / °W from Greenwich). Use the fine-tuning sliders for micro-adjustments.',
    icon: <Compass className="w-5 h-5 text-cyan-400" />,
    position: 'top-left',
  },
  {
    id: 'controls',
    title: '3. Graticule & Layer Controls',
    badge: 'Beginner Assist',
    description: 'Turn on the 15° Graticule Grid lines to visually count degrees. Toggle the glowing Equator (0° Lat, Amber) and Prime Meridian (0° Lon, Cyan).',
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
    position: 'bottom-left',
  },
  {
    id: 'challenge',
    title: '4. Challenge Mode & Directional Radar',
    badge: 'Gamified Missions',
    description: 'Solve Stage 1 (Find Countries) and Stage 2 (Exact Coordinates). Live radar provides directional clues (e.g., ⬆️ Move North) and temperature tiers without spoiling coordinates!',
    icon: <Target className="w-5 h-5 text-rose-400" />,
    position: 'bottom-left',
  },
  {
    id: 'jump',
    title: '5. Direct Coordinate Jump',
    badge: 'Fast Navigation',
    description: 'Have a specific coordinate in mind? Click "Jump" or "Enter Coords" to type exact degrees and smoothly fly the camera right to that spot.',
    icon: <MapPin className="w-5 h-5 text-emerald-400" />,
    position: 'top-left',
  },
];

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    soundManager.playClick();
    if (isLast) {
      onComplete();
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* CARD CONTAINER */}
      <div className="bg-slate-900/95 border-2 border-amber-500/50 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 flex flex-col gap-5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            {step.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {step.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">
              {step.title}
            </h3>
          </div>
        </div>

        {/* STEP DESCRIPTION */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 text-sm text-slate-300 leading-relaxed">
          {step.description}
        </div>

        {/* STEP INDICATORS */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'w-6 bg-amber-400'
                    : idx < currentStepIndex
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <span>{isLast ? 'Start Exploring! 🚀' : 'Next Step'}</span>
              {!isLast && <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
