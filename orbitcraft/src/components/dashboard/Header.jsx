import React from 'react';
import { Rocket, Trophy, BookOpen, RotateCcw, User } from 'lucide-react';

export default function Header({
  callsign,
  onCallsignChange,
  completedCount = 0,
  totalMissions = 4,
  onResetProgress,
  onOpenHandbook,
  onOpenLeaderboard
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Sisi Kiri: Judul & Tim */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-wider font-mono">
                ORBITCRAFT
              </h1>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase">
                NASA Space Apps
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Modular Systems Architect — Team Bhapp
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Input Nama Pilot, Status & Tombol Aksi */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* INPUT CALLSIGN PEMAIN */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-xs font-mono shadow-inner focus-within:border-cyan-400 transition-colors">
            <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">CALLSIGN:</span>
            <input
              type="text"
              value={callsign}
              onChange={(e) => onCallsignChange(e.target.value)}
              placeholder="Cmdr. Name"
              maxLength={18}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none w-28 sm:w-32 text-xs placeholder:text-slate-600 font-mono"
            />
          </div>

          {/* Progress Indikator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-400">Missions:</span>
            <span className="text-emerald-400 font-bold">{completedCount}/{totalMissions}</span>
          </div>

          {/* Tombol Leaderboard */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-mono transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          {/* Tombol Handbook */}
          <button
            type="button"
            onClick={onOpenHandbook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-400 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Handbook</span>
          </button>

          {/* Tombol Reset */}
          <button
            type="button"
            onClick={onResetProgress}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
            title="Reset All Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}