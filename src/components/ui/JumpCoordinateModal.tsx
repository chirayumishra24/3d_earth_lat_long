'use client';

import React, { useState } from 'react';
import { X, Send, Compass, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface JumpCoordinateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJump: (lat: number, lon: number) => void;
  currentLat: number;
  currentLon: number;
}

export const JumpCoordinateModal: React.FC<JumpCoordinateModalProps> = ({
  isOpen,
  onClose,
  onJump,
  currentLat,
  currentLon,
}) => {
  const [latVal, setLatVal] = useState<string>(Math.abs(currentLat).toFixed(2));
  const [latDir, setLatDir] = useState<'N' | 'S'>(currentLat >= 0 ? 'N' : 'S');
  const [lonVal, setLonVal] = useState<string>(Math.abs(currentLon).toFixed(2));
  const [lonDir, setLonDir] = useState<'E' | 'W'>(currentLon >= 0 ? 'E' : 'W');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(latVal);
    const parsedLon = parseFloat(lonVal);

    if (isNaN(parsedLat) || parsedLat < 0 || parsedLat > 90) {
      setError('Latitude must be a valid number between 0° and 90°');
      return;
    }
    if (isNaN(parsedLon) || parsedLon < 0 || parsedLon > 180) {
      setError('Longitude must be a valid number between 0° and 180°');
      return;
    }

    const finalLat = latDir === 'N' ? parsedLat : -parsedLat;
    const finalLon = lonDir === 'E' ? parsedLon : -parsedLon;

    soundManager.playPinDrop();
    onJump(finalLat, finalLon);
    onClose();
  };

  const applyPreset = (lat: number, lon: number) => {
    setLatVal(Math.abs(lat).toFixed(2));
    setLatDir(lat >= 0 ? 'N' : 'S');
    setLonVal(Math.abs(lon).toFixed(2));
    setLonDir(lon >= 0 ? 'E' : 'W');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 w-full max-w-md rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-5 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* MODAL TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Jump to Coordinates</h3>
            <p className="text-xs text-slate-400">Enter custom Latitude and Longitude values</p>
          </div>
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* LATITUDE ROW */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Latitude Parallel (0° – 90°)</span>
              <span className="text-[11px] text-amber-400 font-mono">Equator is 0°</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                min="0"
                max="90"
                value={latVal}
                onChange={(e) => {
                  setLatVal(e.target.value);
                  setError(null);
                }}
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. 28.61"
                required
              />
              <div className="flex bg-slate-950/80 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setLatDir('N')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    latDir === 'N' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  North (N)
                </button>
                <button
                  type="button"
                  onClick={() => setLatDir('S')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    latDir === 'S' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  South (S)
                </button>
              </div>
            </div>
          </div>

          {/* LONGITUDE ROW */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Longitude Meridian (0° – 180°)</span>
              <span className="text-[11px] text-cyan-400 font-mono">Prime Meridian is 0°</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                min="0"
                max="180"
                value={lonVal}
                onChange={(e) => {
                  setLonVal(e.target.value);
                  setError(null);
                }}
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 77.23"
                required
              />
              <div className="flex bg-slate-950/80 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setLonDir('E')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    lonDir === 'E' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  East (E)
                </button>
                <button
                  type="button"
                  onClick={() => setLonDir('W')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    lonDir === 'W' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  West (W)
                </button>
              </div>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* QUICK PRESET BUTTONS */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Quick Landmark Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Null Island (0°, 0°)', lat: 0, lon: 0 },
                { name: 'Greenwich, UK', lat: 51.48, lon: 0.0 },
                { name: 'New Delhi', lat: 28.61, lon: 77.23 },
                { name: 'Tokyo', lat: 35.68, lon: 139.69 },
                { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
                { name: 'Sydney', lat: -33.87, lon: 151.21 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset.lat, preset.lon)}
                  className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-white/5 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all mt-2 active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>Fly Camera & Drop Pin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
