'use client';

import React from 'react';
import { X, Globe2, Compass, Grid, Sparkles, Navigation } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col gap-6 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TITLE */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center text-slate-950">
            <Globe2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Interactive Reference Guide
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              How Earth Coordinates Work
            </h2>
          </div>
        </div>

        {/* 3 KEY LESSON BLOCKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. LATITUDE PARALLELS */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-xs">
                1
              </span>
              <span>Latitude (Parallels)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Horizontal rings measuring distance <strong>North (N)</strong> or{' '}
              <strong>South (S)</strong> from the <strong>Equator (0°)</strong>.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside mt-1 font-mono">
              <li>North Pole: 90° N</li>
              <li>Tropic of Cancer: 23.5° N</li>
              <li>Equator: 0° (Amber Line)</li>
              <li>Tropic of Capricorn: 23.5° S</li>
              <li>South Pole: 90° S</li>
            </ul>
          </div>

          {/* 2. LONGITUDE MERIDIANS */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-cyan-500/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-xs">
                2
              </span>
              <span>Longitude (Meridians)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vertical pole-to-pole arcs measuring distance <strong>East (E)</strong> or{' '}
              <strong>West (W)</strong> from the <strong>Prime Meridian (0°)</strong> in Greenwich, UK.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside mt-1 font-mono">
              <li>Prime Meridian: 0° (Cyan Line)</li>
              <li>Eastern Hemisphere: 0° to 180° E</li>
              <li>Western Hemisphere: 0° to 180° W</li>
              <li>Antimeridian: 180° (Date Line)</li>
            </ul>
          </div>
        </div>

        {/* 3. HOW TO READ & WRITE COORDINATES */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 flex flex-col gap-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Format: (Latitude, Longitude)</span>
          </h4>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-white/5 font-mono text-center text-base sm:text-lg font-bold text-emerald-400 flex items-center justify-center gap-2">
            <span className="text-amber-400">28.61° N</span>
            <span className="text-slate-500">,</span>
            <span className="text-cyan-400">77.23° E</span>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Always write Latitude first (North/South), followed by Longitude (East/West).
          </p>
        </div>

        {/* 4. INTERACTION CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
            <span className="font-bold text-slate-100">🖱️ Drag to Rotate</span>
            <span className="text-[11px] text-slate-400">Click & drag to spin the 3D globe freely.</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
            <span className="font-bold text-slate-100">📍 Click or Drag Pin</span>
            <span className="text-[11px] text-slate-400">Tap anywhere to drop the amber marker.</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
            <span className="font-bold text-slate-100">🌐 15° Grid Toggle</span>
            <span className="text-[11px] text-slate-400">Turn on graticule lines to count degrees.</span>
          </div>
        </div>

        {/* CLOSE ACTION */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
        >
          Got It, Let's Explore!
        </button>
      </div>
    </div>
  );
};
