'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  BookOpen,
  Compass,
  Layers,
  Globe2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface VisualChapterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToLessonPreset?: (lat: number, lon: number) => void;
}

interface ChapterSlide {
  id: string;
  title: string;
  badge: string;
  imageSrc: string;
  summary: string;
  keyPoints: string[];
  presetLat?: number;
  presetLon?: number;
  presetLabel?: string;
}

const CHAPTER_SLIDES: ChapterSlide[] = [
  {
    id: 'latitude',
    title: '1. Parallels of Latitude',
    badge: 'North & South Measurement',
    imageSrc: '/images/latitude_diagram.jpg',
    summary: 'Latitude lines are horizontal circles running parallel to the Equator (0°). They never touch and measure angular distance from 0° at the Equator up to 90° N at the North Pole and 90° S at the South Pole.',
    keyPoints: [
      'Equator (0°): The longest parallel, dividing Earth into Northern and Southern Hemispheres.',
      'Tropic of Cancer (23.5° N): The northernmost limit where the Sun can appear directly overhead.',
      'Tropic of Capricorn (23.5° S): The southernmost limit where the Sun can appear directly overhead.',
      'Poles (90° N & 90° S): Singular geographic points at the ends of Earth\'s rotational axis.',
    ],
    presetLat: 23.5,
    presetLon: 78.0,
    presetLabel: 'Fly to Tropic of Cancer',
  },
  {
    id: 'longitude',
    title: '2. Meridians of Longitude',
    badge: 'East & West Measurement',
    imageSrc: '/images/longitude_diagram.jpg',
    summary: 'Meridians of longitude are semi-circles running from the North Pole to the South Pole. Unlike latitude parallels, all longitude meridians are equal in length and converge at the poles.',
    keyPoints: [
      'Prime Meridian (0°): Passes through the Royal Observatory in Greenwich, London, UK.',
      'Eastern Hemisphere: Measures 0° to 180° East of Greenwich.',
      'Western Hemisphere: Measures 0° to 180° West of Greenwich.',
      'International Date Line (180°): Sits opposite the Prime Meridian in the Pacific Ocean.',
    ],
    presetLat: 51.5,
    presetLon: 0.0,
    presetLabel: 'Fly to Prime Meridian (Greenwich)',
  },
  {
    id: 'hemispheres',
    title: '3. The Four Hemispheres',
    badge: 'Global Quadrants',
    imageSrc: '/images/hemispheres_diagram.jpg',
    summary: 'Earth is divided into 4 hemispheres by two key baseline circles: The Equator divides North vs South, while the Prime Meridian (0°) & Antimeridian (180°) divide East vs West.',
    keyPoints: [
      'Northern Hemisphere: Contains ~68% of Earth\'s landmass (North America, Europe, Asia).',
      'Southern Hemisphere: Dominated by vast oceans (~80% water coverage, Australia, Antarctica).',
      'Eastern Hemisphere: Home to Africa, Europe, Asia, and Australia.',
      'Western Hemisphere: Home to North and South America.',
    ],
    presetLat: 0.0,
    presetLon: 0.0,
    presetLabel: 'Fly to Null Island (0°, 0°)',
  },
];

export const VisualChapterGuideModal: React.FC<VisualChapterGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToLessonPreset,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentSlide = CHAPTER_SLIDES[activeSlideIndex];
  const isFirst = activeSlideIndex === 0;
  const isLast = activeSlideIndex === CHAPTER_SLIDES.length - 1;

  const handleNext = () => {
    soundManager.playClick();
    if (!isLast) setActiveSlideIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (!isFirst) setActiveSlideIndex((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900/95 border border-cyan-500/30 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col gap-6 relative">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Illustrated Chapter Reference
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Topic {activeSlideIndex + 1} of {CHAPTER_SLIDES.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
              {currentSlide.title}
            </h2>
          </div>
        </div>

        {/* SLIDE CONTENT (IMAGE + LESSON EXPLANATIONS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* GENERATED INFOGRAPHIC IMAGE CONTAINER */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-xl group">
              <Image
                src={currentSlide.imageSrc}
                alt={currentSlide.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-[10px] text-slate-400 text-center italic">
              Fig {activeSlideIndex + 1}: Conceptual diagram of {currentSlide.title}
            </span>
          </div>

          {/* LESSON TEXT & BULLETS */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Core Concept
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentSlide.summary}
              </p>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Key Classroom Takeaways:
              </h4>
              <ul className="space-y-2">
                {currentSlide.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRESET FLY-TO TRIGGER */}
            {currentSlide.presetLat !== undefined && currentSlide.presetLon !== undefined && (
              <button
                onClick={() => {
                  soundManager.playPinDrop();
                  if (onJumpToLessonPreset) {
                    onJumpToLessonPreset(currentSlide.presetLat!, currentSlide.presetLon!);
                  }
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>{currentSlide.presetLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* SLIDE NAVIGATION BAR */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5">
            {CHAPTER_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveSlideIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeSlideIndex
                    ? 'w-8 bg-cyan-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isFirst
                  ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isLast}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isLast
                  ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <span>Next Topic</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
