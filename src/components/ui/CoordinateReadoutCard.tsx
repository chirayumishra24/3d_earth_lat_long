'use client';

import React from 'react';
import {
  MapPin,
  Compass,
  CheckCircle2,
  Crosshair,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { formatCoordinates, findNearestLocation } from '@/lib/geo';
import { soundManager } from '@/lib/audio';

interface CoordinateReadoutCardProps {
  lat: number;
  lon: number;
  onCoordinateChange: (lat: number, lon: number) => void;
  mode: 'explore' | 'challenge';
  stage?: 1 | 2;
  challengeIndex?: number;
  totalChallenges?: number;
  onCheckAnswer?: () => void;
  onCenterCamera?: () => void;
  onOpenJumpModal?: () => void;
}

export const CoordinateReadoutCard: React.FC<CoordinateReadoutCardProps> = ({
  lat,
  lon,
  onCoordinateChange,
  mode,
  stage = 1,
  challengeIndex = 0,
  totalChallenges = 5,
  onCheckAnswer,
  onCenterCamera,
  onOpenJumpModal,
}) => {
  const { latValue, latDir, lonValue, lonDir } = formatCoordinates(lat, lon);
  const { location: nearest, distanceKm } = findNearestLocation(lat, lon);

  const handleLatSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCoordinateChange(parseFloat(e.target.value), lon);
  };

  const handleLonSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCoordinateChange(lat, parseFloat(e.target.value));
  };

  return (
    <aside className="bg-slate-900/85 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl w-full max-w-[340px] text-slate-100 flex flex-col gap-4 select-none">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
            {mode === 'explore'
              ? 'Live Coordinate Readout'
              : `Stage ${stage} · Challenge ${challengeIndex + 1}/${totalChallenges}`}
          </span>
        </div>
        <button
          onClick={onOpenJumpModal}
          title="Direct Coordinate Entry"
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-white/5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Jump</span>
        </button>
      </div>

      {/* LARGE INSTRUMENT READOUT NUMERALS */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
        {/* LATITUDE BLOCK */}
        <div className="flex flex-col">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Latitude</span>
            <span className="text-[9px] text-amber-400/80 font-mono">[-90°..90°]</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-bold text-slate-50 tracking-tight">
              {latValue}°
            </span>
            <span className={`text-base font-bold ${latDir === 'N' ? 'text-cyan-400' : 'text-amber-400'}`}>
              {latDir}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {lat >= 0 ? 'North of Equator' : 'South of Equator'}
          </span>
        </div>

        {/* LONGITUDE BLOCK */}
        <div className="flex flex-col border-l border-white/10 pl-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Longitude</span>
            <span className="text-[9px] text-cyan-400/80 font-mono">[-180°..180°]</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-bold text-slate-50 tracking-tight">
              {lonValue}°
            </span>
            <span className={`text-base font-bold ${lonDir === 'E' ? 'text-cyan-400' : 'text-amber-400'}`}>
              {lonDir}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {lon >= 0 ? 'East of Prime Meridian' : 'West of Prime Meridian'}
          </span>
        </div>
      </div>

      {/* NEAREST LOCATION / REGION TAG */}
      <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-2 rounded-xl border border-white/5 text-xs text-slate-300">
        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
        <div className="truncate flex-1">
          <span className="text-slate-400">Nearest: </span>
          <span className="font-semibold text-slate-100">{nearest.name}</span>
          {distanceKm > 50 && (
            <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
              (~{distanceKm.toLocaleString()} km)
            </span>
          )}
        </div>
      </div>

      {/* INTERACTIVE DUAL SLIDERS */}
      <div className="flex flex-col gap-2.5 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
        {/* Latitude Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
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

        {/* Longitude Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
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

      {/* PRIMARY ACTION PILL BUTTON */}
      {mode === 'challenge' ? (
        <button
          onClick={() => {
            soundManager.playClick();
            if (onCheckAnswer) onCheckAnswer();
          }}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Check My Answer</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playPinDrop();
              if (onCenterCamera) onCenterCamera();
            }}
            className="flex-1 py-2.5 px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
            <span>Center on Pin</span>
          </button>
          <button
            onClick={onOpenJumpModal}
            className="py-2.5 px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enter Coords</span>
          </button>
        </div>
      )}
    </aside>
  );
};
