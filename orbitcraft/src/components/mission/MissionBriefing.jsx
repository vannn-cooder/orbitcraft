import React from 'react';
import { Target, Weight, Zap, DollarSign, Radio, Orbit, Clock, ShieldAlert } from 'lucide-react';

export default function MissionBriefing({ mission }) {
  if (!mission) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Flight Profile Dossier
          </span>
          <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">
            {mission.name}
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Duration:</span>
          <span className="text-slate-200 font-semibold">{mission.missionDuration}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-5 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
        {mission.description}
      </p>

      {/* Core Engineering Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {/* Launcher Capacity */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Weight className="w-4 h-4 text-sky-400" />
            <span>Launch Cap</span>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold font-mono text-white">{mission.payloadCapacityKg}</span>
            <span className="text-xs text-slate-400 ml-1">kg</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 truncate" title={mission.launchVehicle?.name}>
            {mission.launchVehicle?.name}
          </span>
        </div>

        {/* Delta-V Req */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Orbit className="w-4 h-4 text-emerald-400" />
            <span>Req. Delta-v</span>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold font-mono text-emerald-400">{mission.requiredDeltaV}</span>
            <span className="text-xs text-slate-400 ml-1">m/s</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Hohmann / Orbit Insertion</span>
        </div>

        {/* Solar & Eclipse */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Eclipse Time</span>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold font-mono text-amber-400">
              {mission.powerRequirements?.eclipseDurationHours}
            </span>
            <span className="text-xs text-slate-400 ml-1">hrs dark</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">
            Flux: {(mission.powerRequirements?.solarFluxMultiplier * 100).toFixed(0)}% AU
          </span>
        </div>

        {/* Downlink Requirement */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Radio className="w-4 h-4 text-indigo-400" />
            <span>Min Downlink</span>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold font-mono text-indigo-400">
              {mission.communicationRequirements?.minDownlinkRateMbps}
            </span>
            <span className="text-xs text-slate-400 ml-1">Mbps</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">
            Window: {mission.communicationRequirements?.commWindowHours}h
          </span>
        </div>

        {/* Mission Budget Cap */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <DollarSign className="w-4 h-4 text-teal-400" />
            <span>Budget Cap</span>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold font-mono text-teal-400">
              ${(mission.maximumBudget / 1000).toFixed(0)}k
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Procurement Limit</span>
        </div>
      </div>

      {/* Special Constraints & Mandatory Systems */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-lg p-3.5 text-xs font-mono">
        <div className="flex items-center space-x-2 text-amber-400 mb-1 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span className="uppercase tracking-wider">Mandatory Systems & Mission Constraints</span>
        </div>
        <p className="text-slate-300 leading-normal mb-2">
          {mission.specialConstraints?.notes}
        </p>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
            Target Science Value: <strong className="text-cyan-400">{mission.requiredScientificValue} pts</strong>
          </span>
          {mission.specialConstraints?.requiredSubRoles?.map((role) => (
            <span key={role} className="bg-amber-950/60 border border-amber-800/70 text-amber-300 px-2 py-0.5 rounded uppercase">
              Req: {role}
            </span>
          ))}
          {mission.specialConstraints?.requiredBusId && (
            <span className="bg-rose-950/60 border border-rose-800/70 text-rose-300 px-2 py-0.5 rounded">
              Req Bus: {mission.specialConstraints.requiredBusId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}