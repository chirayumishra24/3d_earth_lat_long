'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Printer,
  Compass,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { soundManager } from '@/lib/audio';
import { voiceNarrator } from '@/lib/voice';

interface AssessmentModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGlobeTask?: (lat: number, lon: number) => void;
}

type AssessmentStep = 'slides' | 'mcq' | 'match' | 'dragdrop' | 'report';

interface SlideData {
  title: string;
  badge: string;
  imageSrc: string;
  narration: string;
  bullets: string[];
}

const LEARNING_SLIDES: SlideData[] = [
  {
    title: '1. Parallels of Latitude',
    badge: 'North & South Reference',
    imageSrc: '/images/latitude_diagram.jpg',
    narration:
      'Latitude lines, also called parallels, are horizontal imaginary circles running east to west around the Earth. The Equator sits at zero degrees and divides Earth into Northern and Southern Hemispheres. Parallels never meet each other and range from zero degrees to ninety degrees north and south at the poles.',
    bullets: [
      'Equator (0°): The baseline dividing Northern & Southern Hemispheres.',
      'Tropic of Cancer (23.5° N) & Capricorn (23.5° S): Solar overhead boundaries.',
      'North Pole (90° N) & South Pole (90° S): Earth rotational axis endpoints.',
    ],
  },
  {
    title: '2. Meridians of Longitude',
    badge: 'East & West Reference',
    imageSrc: '/images/longitude_diagram.jpg',
    narration:
      'Meridians of longitude are vertical imaginary semi-circles running from the North Pole to the South Pole. The Prime Meridian at zero degrees passes through Greenwich, London, and divides Earth into Eastern and Western Hemispheres. All meridians meet at the poles.',
    bullets: [
      'Prime Meridian (0°): Global reference meridian passing through Greenwich, UK.',
      'All meridians converge and meet at both North & South Poles.',
      'Earth rotates 15 degrees every hour, creating our 24 world time zones.',
    ],
  },
  {
    title: '3. The Four Hemispheres',
    badge: 'Global Spatial Quadrants',
    imageSrc: '/images/hemispheres_diagram.jpg',
    narration:
      'The Earth is divided into four hemispheres. The Equator creates Northern and Southern Hemispheres, while the Prime Meridian and 180 degree Antimeridian create Eastern and Western Hemispheres. Every coordinate pair gives us an exact unique spot on our planet.',
    bullets: [
      'Northern Hemisphere contains the majority of world continents.',
      'Southern Hemisphere is predominantly covered by vast oceans.',
      'Eastern & Western Hemispheres are split by Greenwich and the 180° Date Line.',
    ],
  },
];

interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    question: 'Which imaginary line divides Earth into Northern and Southern Hemispheres?',
    options: ['Prime Meridian', 'Equator (0°)', 'Tropic of Cancer', 'Arctic Circle'],
    correctIndex: 1,
    explanation: 'The Equator (0° latitude) is the great circle that splits Earth into North and South.',
  },
  {
    question: 'Where does the Prime Meridian (0° Longitude) pass through?',
    options: ['Paris, France', 'New York, USA', 'Greenwich, London, UK', 'Tokyo, Japan'],
    correctIndex: 2,
    explanation: 'The Prime Meridian passes through the Royal Observatory in Greenwich, London.',
  },
  {
    question: 'What is the maximum latitude angle possible on Earth?',
    options: ['45°', '90° (at the poles)', '180°', '360°'],
    correctIndex: 1,
    explanation: 'Latitude is measured from 0° at the Equator up to 90° at the North and South Poles.',
  },
];

interface MatchItem {
  id: string;
  leftText: string;
  rightText: string;
}

const MATCH_PAIRS: MatchItem[] = [
  { id: '1', leftText: 'Equator', rightText: '0° Latitude (Baseline)' },
  { id: '2', leftText: 'Prime Meridian', rightText: '0° Longitude (Greenwich)' },
  { id: '3', leftText: 'Tropic of Cancer', rightText: '23.5° North Latitude' },
  { id: '4', leftText: 'North Pole', rightText: '90° North Coordinate' },
];

interface DragItem {
  id: string;
  text: string;
  correctZone: 'North' | 'South' | 'East' | 'West';
}

const DRAG_ITEMS: DragItem[] = [
  { id: 'd1', text: 'North America', correctZone: 'North' },
  { id: 'd2', text: 'Australia', correctZone: 'South' },
  { id: 'd3', text: 'Asia & India', correctZone: 'East' },
  { id: 'd4', text: 'South America', correctZone: 'West' },
];

export const AssessmentModuleModal: React.FC<AssessmentModuleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('slides');
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Young Cartographer');

  // MCQ State
  const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>([null, null, null]);
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  // Match the Column State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ [leftId: string]: string }>({});

  // Drag & Drop State
  const [selectedDragItem, setSelectedDragItem] = useState<DragItem | null>(null);
  const [placedItems, setPlacedItems] = useState<{ [itemId: string]: string }>({});

  // Stop voice narration when closing
  useEffect(() => {
    if (!isOpen) {
      voiceNarrator.stop();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Audio Playback
  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceNarrator.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voiceNarrator.speak(LEARNING_SLIDES[slideIndex].narration, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleSlideChange = (newIndex: number) => {
    voiceNarrator.stop();
    setIsSpeaking(false);
    setSlideIndex(newIndex);
  };

  // Match Click Handler
  const handleSelectLeft = (id: string) => {
    soundManager.playClick();
    setSelectedLeft(id);
  };

  const handleSelectRight = (targetRightText: string) => {
    if (!selectedLeft) return;
    soundManager.playClick();
    setMatchedPairs((prev) => ({
      ...prev,
      [selectedLeft]: targetRightText,
    }));
    setSelectedLeft(null);
  };

  // Drag Drop Click Handler
  const handlePlaceItem = (zone: 'North' | 'South' | 'East' | 'West') => {
    if (!selectedDragItem) return;
    soundManager.playClick();
    setPlacedItems((prev) => ({
      ...prev,
      [selectedDragItem.id]: zone,
    }));
    setSelectedDragItem(null);
  };

  // Score Calculations
  const calculateTotalScore = () => {
    let score = 0;
    // MCQ: 30 pts (10 each)
    mcqAnswers.forEach((ans, idx) => {
      if (ans === MCQ_QUESTIONS[idx].correctIndex) score += 10;
    });

    // Match: 40 pts (10 each)
    MATCH_PAIRS.forEach((pair) => {
      if (matchedPairs[pair.id] === pair.rightText) score += 10;
    });

    // Drag Drop: 30 pts (7.5 each rounded = 30)
    DRAG_ITEMS.forEach((item) => {
      if (placedItems[item.id] === item.correctZone) score += 7.5;
    });

    return Math.round(score);
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900/95 border border-cyan-500/30 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col gap-6 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            voiceNarrator.stop();
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TOP NAVIGATION BREADCRUMB / STEPS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Classroom Learning & Assessment Lab
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight mt-1">
                {currentStep === 'slides' && 'Part 1: Interactive Audio Lesson'}
                {currentStep === 'mcq' && 'Part 2: Concept Knowledge Check'}
                {currentStep === 'match' && 'Part 3: Match the Column'}
                {currentStep === 'dragdrop' && 'Part 4: Hemisphere Sorting Activity'}
                {currentStep === 'report' && 'Student Performance & Certificate'}
              </h2>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="hidden sm:flex items-center gap-2">
            {(['slides', 'mcq', 'match', 'dragdrop', 'report'] as AssessmentStep[]).map((step, idx) => (
              <button
                key={step}
                onClick={() => {
                  voiceNarrator.stop();
                  setIsSpeaking(false);
                  setCurrentStep(step);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  currentStep === step
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {idx + 1}. {step.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: INTERACTIVE SLIDES WITH AUDIO VOICE NARRATION */}
        {/* ========================================================================= */}
        {currentStep === 'slides' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Generated Visual Diagram */}
              <div className="lg:col-span-7 flex flex-col gap-2">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-xl group">
                  <Image
                    src={LEARNING_SLIDES[slideIndex].imageSrc}
                    alt={LEARNING_SLIDES[slideIndex].title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Diagram {slideIndex + 1} of {LEARNING_SLIDES.length}</span>
                  {/* Audio Voice Narration Button */}
                  <button
                    onClick={handleToggleVoice}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSpeaking
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : '🔊 Listen with Audio'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Text & Key Points */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {LEARNING_SLIDES[slideIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {LEARNING_SLIDES[slideIndex].narration}
                  </p>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Key Highlights:
                  </h4>
                  <ul className="space-y-2">
                    {LEARNING_SLIDES[slideIndex].bullets.map((b, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Slider Nav */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                {LEARNING_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlideChange(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === slideIndex ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSlideChange(Math.max(0, slideIndex - 1))}
                  disabled={slideIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Prev
                </button>

                {slideIndex < LEARNING_SLIDES.length - 1 ? (
                  <button
                    onClick={() => handleSlideChange(slideIndex + 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    Next Slide
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      voiceNarrator.stop();
                      setCurrentStep('mcq');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/25"
                  >
                    Start Quiz (Part 2) →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CONCEPT CHECK MCQS */}
        {/* ========================================================================= */}
        {currentStep === 'mcq' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="space-y-4">
              {MCQ_QUESTIONS.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
                  <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                      {qIdx + 1}
                    </span>
                    <span>{q.question}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = mcqAnswers[qIdx] === optIdx;
                      const isCorrect = optIdx === q.correctIndex;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            soundManager.playClick();
                            const newAns = [...mcqAnswers];
                            newAns[qIdx] = optIdx;
                            setMcqAnswers(newAns);
                          }}
                          className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                            isSelected
                              ? mcqSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                  : 'bg-rose-500/20 border-rose-500 text-rose-300'
                                : 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-900 border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {mcqSubmitted && (
                    <div className="text-[11px] text-slate-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      💡 <span className="font-semibold text-slate-300">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => setCurrentStep('slides')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                ← Back to Slides
              </button>

              {!mcqSubmitted ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMcqSubmitted(true);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  Verify Answers
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep('match')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  Next: Match the Column →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: MATCH THE COLUMN */}
        {/* ========================================================================= */}
        {currentStep === 'match' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/10 text-xs text-slate-300">
              👉 <span className="font-bold text-amber-400">Instructions: </span>
              Click an item on the left (Column A), then click its corresponding definition on the right (Column B) to create a match!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Column A */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Column A (Concepts):
                </span>
                {MATCH_PAIRS.map((item) => {
                  const isSelected = selectedLeft === item.id;
                  const isMatched = !!matchedPairs[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectLeft(item.id)}
                      className={`p-3.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 scale-[1.02]'
                          : isMatched
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-950 border-white/10 text-slate-200 hover:border-white/30'
                      }`}
                    >
                      <span>{item.leftText}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Column B */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Column B (Definitions):
                </span>
                {['23.5° North Latitude', '0° Longitude (Greenwich)', '0° Latitude (Baseline)', '90° North Coordinate'].map((rText, idx) => {
                  const isPaired = Object.values(matchedPairs).includes(rText);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectRight(rText)}
                      className={`p-3.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                        isPaired
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : selectedLeft
                          ? 'bg-slate-900 border-amber-500/40 text-slate-100 hover:bg-slate-800'
                          : 'bg-slate-950 border-white/5 text-slate-400'
                      }`}
                    >
                      {rText}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => setCurrentStep('mcq')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                ← Back to MCQ
              </button>

              <button
                onClick={() => setCurrentStep('dragdrop')}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                Next: Hemisphere Sorting →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: DRAG & DROP HEMISPHERE SORTING */}
        {/* ========================================================================= */}
        {currentStep === 'dragdrop' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/10 text-xs text-slate-300">
              👉 <span className="font-bold text-amber-400">Activity: </span>
              Click a place below to select it, then click the correct Quadrant Box to place it!
            </div>

            {/* Tokens to place */}
            <div className="flex flex-wrap gap-2">
              {DRAG_ITEMS.map((item) => {
                const isSelected = selectedDragItem?.id === item.id;
                const isPlaced = !!placedItems[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedDragItem(item);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 scale-105 shadow-lg'
                        : isPlaced
                        ? 'bg-slate-800/50 border-white/5 text-slate-500'
                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                    }`}
                  >
                    📍 {item.text} {isPlaced ? `(${placedItems[item.id]})` : ''}
                  </button>
                );
              })}
            </div>

            {/* 4 Quadrant Drop Bins */}
            <div className="grid grid-cols-2 gap-4">
              {(['North', 'South', 'East', 'West'] as ('North' | 'South' | 'East' | 'West')[]).map((zone) => (
                <div
                  key={zone}
                  onClick={() => handlePlaceItem(zone)}
                  className={`p-4 rounded-2xl border-2 border-dashed flex flex-col gap-2 min-h-[90px] cursor-pointer transition-all ${
                    selectedDragItem
                      ? 'border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'border-white/15 bg-slate-950/50'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {zone === 'North' && '🌐 Northern Hemisphere'}
                    {zone === 'South' && '🌐 Southern Hemisphere'}
                    {zone === 'East' && '🧭 Eastern Hemisphere'}
                    {zone === 'West' && '🧭 Western Hemisphere'}
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(placedItems)
                      .filter(([_, z]) => z === zone)
                      .map(([id]) => {
                        const item = DRAG_ITEMS.find((d) => d.id === id);
                        return (
                          <span
                            key={id}
                            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          >
                            {item?.text}
                          </span>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => setCurrentStep('match')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                ← Back to Matching
              </button>

              <button
                onClick={() => {
                  soundManager.playSuccess();
                  setCurrentStep('report');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25"
              >
                Generate Report & Certificate 🎓 →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: FINAL STUDENT PERFORMANCE REPORT & CERTIFICATE */}
        {/* ========================================================================= */}
        {currentStep === 'report' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Certificate Box */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 p-6 sm:p-8 rounded-3xl text-center shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/25">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                  Certificate of Cartographic Excellence
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-100 mt-2">
                  Latitude & Longitude Mastery
                </h3>
              </div>

              {/* Student Name Input */}
              <div className="flex items-center gap-2 max-w-sm w-full">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter Student Name"
                  className="w-full text-center bg-slate-950/80 border border-white/20 rounded-xl px-4 py-2 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Score Metric Cards */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-2">
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-white/5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    Overall Score
                  </span>
                  <span className="text-xl font-bold text-amber-400 font-mono">
                    {totalScore} / 100
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-white/5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    Rank Badge
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {totalScore >= 80 ? '⭐ Master Cartographer' : '🧭 Navigator Explorer'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-white/5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    Accuracy
                  </span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">
                    {totalScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-md italic">
                "Demonstrated proficiency in calculating latitude parallels, longitude meridians, hemisphere spatial boundaries, and 3D spherical Earth navigation."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStep('slides');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Lab</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Certificate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
