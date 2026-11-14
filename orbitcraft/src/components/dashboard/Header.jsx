import React from 'react';
import { Rocket, ShieldCheck, AlertTriangle, RotateCcw, Award, BookOpen, Trophy, User } from 'lucide-react';

export default function Header({
  validationResult,
  activeMission,
  completedCount = 0,
  totalMissions = 4,
  onResetProgress,
  onOpenHandbook,
  onOpenLeaderboard,
  onChangeUser,
  username = 'Architect'
}) {
  const isFlightReady = validationResult?.isValid;

  return (
    <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-40 shadow-2xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-lg shadow-inner shadow-cyan-500/20 text-cyan-400">
            <Rocket className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                NASA Space Apps Challenge 2026
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                v1.0.0-PROD
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              OrbitCraft <span className="text-slate-400 font-light text-sm hidden sm:inline">| Modular Systems Architect</span>
            </h1>
          </div>
        </div>

        {/* Telemetry Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* User Call Sign Badge */}
          <button
            type="button"
            onClick={onChangeUser}
            title="Klik untuk ubah nama arsitek"
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 px-2.5 py-1.5 rounded-md font-mono text-xs text-cyan-300 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[100px] font-bold">{username}</span>
          </button>

          {/* Mission Progress Indicator */}
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-md font-mono text-xs">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">{completedCount}/{totalMissions} Passed</span>
          </div>

          {/* Master Flight Readiness Status */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border font-mono text-xs font-bold uppercase transition-all duration-300 ${
              isFlightReady
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
            }`}
          >
            {isFlightReady ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FLIGHT READY</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>DEFICIT</span>
              </>
            )}
          </div>

          {/* Tombol Leaderboard */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            title="Open Global Leaderboard"
            className="flex items-center space-x-1.5 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-700/60 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors shadow-sm cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>

          {/* Tombol Handbook */}
          <button
            type="button"
            onClick={onOpenHandbook}
            title="Open Spacecraft Engineering Handbook"
            className="flex items-center space-x-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Handbook</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetProgress}
            title="Reset All Saved Progress"
            className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}