'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, ArrowRight, CheckCircle2, Globe2, BookOpen } from 'lucide-react';
import { Challenge } from '@/lib/challenges';
import { formatCoordinates } from '@/lib/geo';
import { soundManager } from '@/lib/audio';

interface SuccessModalProps {
  isOpen: boolean;
  challenge: Challenge;
  scoreAwarded: number;
  totalScore: number;
  streak: number;
  onNextChallenge: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  challenge,
  scoreAwarded,
  totalScore,
  streak,
  onNextChallenge,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playSuccess();
      // Multi-cannon celebratory confetti
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetCoords = formatCoordinates(challenge.targetLat, challenge.targetLon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col gap-6 relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* HEADER BADGE */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[2.5] animate-bounce" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              🎯 TARGET DISCOVERED!
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">
            {challenge.countryName}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Exact Location: {targetCoords.fullFormatted}
          </p>
        </div>

        {/* STATS HIGHLIGHT */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Score Earned
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              +{scoreAwarded}
            </span>
          </div>
          <div className="flex flex-col border-x border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Score
            </span>
            <span className="text-lg font-bold text-slate-100 font-mono">
              {totalScore}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Streak
            </span>
            <span className="text-lg font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              {streak}x
            </span>
          </div>
        </div>

        {/* GEOGRAPHICAL FACT / TRIVIA CARD */}
        <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 flex gap-3.5 items-start">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Did You Know?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {challenge.funFact}
            </p>
          </div>
        </div>

        {/* NEXT CHALLENGE BUTTON */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNextChallenge();
          }}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Continue to Next Challenge</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
