import React from 'react';
import { Target, Lock, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

export default function MissionSelector({
  missions = [],
  activeMissionId,
  unlockedMissionIds = [],
  completedMissionIds = [],
  onSelectMission
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Compass className="w-5 h-5" />
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
            Mission Flight Contracts
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Select target mission scenario
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {missions.map((mission) => {
          const isSelected = mission.id === activeMissionId;
          const isUnlocked = unlockedMissionIds.includes(mission.id);
          const isCompleted = completedMissionIds.includes(mission.id);

          return (
            <button
              key={mission.id}
              disabled={!isUnlocked}
              onClick={() => onSelectMission(mission.id)}
              className={`relative text-left p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400'
                  : isUnlocked
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  : 'bg-slate-950/30 border-slate-900 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Card Header Status */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  mission.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  mission.difficulty === 'Intermediate' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                  mission.difficulty === 'Advanced' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {mission.difficulty}
                </span>

                <div className="flex items-center space-x-1">
                  {isCompleted && (
                    <span title="Mission Completed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </span>
                  )}
                  {!isUnlocked && (
                    <span title="Mission Locked">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Orbit */}
              <div>
                <h3 className={`text-sm font-bold line-clamp-1 ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {mission.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1 line-clamp-1">
                  Target: {mission.targetOrbit.split('(')[0]}
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Δv: <strong className="text-slate-200">{mission.requiredDeltaV} m/s</strong></span>
                <span>Max: <strong className="text-slate-200">{mission.payloadCapacityKg} kg</strong></span>
              </div>

              {/* Active Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}