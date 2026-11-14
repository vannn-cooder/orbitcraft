import React from 'react';
import { Weight, Orbit, Zap, Radio, DollarSign, Award, AlertCircle, CheckCircle } from 'lucide-react';

export default function EngineeringGauges({ validationResult }) {
  if (!validationResult || !validationResult.subsystems) return null;

  const { mass, propulsion, power, communication, budget } = validationResult.subsystems;
  const scientificScore = validationResult.scientificScore || 0;
  const targetScience = validationResult.targetScientificValue || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Orbit className="w-5 h-5" />
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
            Real-Time Engineering Telemetry
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Continuous Systems Validation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* 1. Mass Budget */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold uppercase">
                <Weight className="w-4 h-4" /> Mass Budget
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                mass.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {mass.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <span className="text-2xl font-bold text-white">{mass.metrics?.totalMassKg}</span>
              <span className="text-xs text-slate-400">/ {mass.metrics?.maxCapacityKg} kg</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  mass.metrics?.isOverweight
                    ? 'bg-rose-500'
                    : mass.metrics?.utilizationPercentage > 85
                    ? 'bg-amber-400'
                    : 'bg-sky-400'
                }`}
                style={{ width: `${Math.min(100, mass.metrics?.utilizationPercentage || 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Dry: <strong className="text-slate-200">{mass.metrics?.dryMassKg} kg</strong></span>
            <span>Prop: <strong className="text-slate-200">{mass.metrics?.propellantMassKg} kg</strong></span>
            <span>Margin: <strong className={mass.metrics?.remainingMarginKg < 0 ? 'text-rose-400' : 'text-emerald-400'}>
              {mass.metrics?.remainingMarginKg} kg
            </strong></span>
          </div>
        </div>

        {/* 2. Delta-v Budget */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
                <Orbit className="w-4 h-4" /> Delta-v Capacity
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                propulsion.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {propulsion.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <span className="text-2xl font-bold text-white">{propulsion.metrics?.availableDeltaV}</span>
              <span className="text-xs text-slate-400">/ {propulsion.metrics?.requiredDeltaV} m/s</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  propulsion.status === 'PASS' ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    propulsion.metrics?.requiredDeltaV > 0
                      ? (propulsion.metrics.availableDeltaV / propulsion.metrics.requiredDeltaV) * 100
                      : 0
                  )}%`
                }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Isp: <strong className="text-slate-200">{propulsion.metrics?.effectiveIsp} s</strong></span>
            <span>Thrust: <strong className="text-slate-200">{propulsion.metrics?.totalThrustN} N</strong></span>
            <span>Margin: <strong className={propulsion.metrics?.deltaVMargin < 0 ? 'text-rose-400' : 'text-emerald-400'}>
              {propulsion.metrics?.deltaVMargin} m/s
            </strong></span>
          </div>
        </div>

        {/* 3. Power & Eclipse Matrix */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase">
                <Zap className="w-4 h-4" /> Power & Eclipse
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                power.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {power.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <span className="text-2xl font-bold text-white">
                {power.metrics?.daylightNetMarginW > 0 ? `+${power.metrics?.daylightNetMarginW}` : power.metrics?.daylightNetMarginW}
              </span>
              <span className="text-xs text-slate-400">W Daylight Margin</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  power.metrics?.survivesEclipse ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, power.metrics?.batteryUtilizationPct || 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Gen: <strong className="text-slate-200">{power.metrics?.daylightGenerationW} W</strong></span>
            <span>Load: <strong className="text-slate-200">{power.metrics?.totalConsumptionW} W</strong></span>
            <span>Battery: <strong className={power.metrics?.survivesEclipse ? 'text-emerald-400' : 'text-rose-400'}>
              {power.metrics?.totalBatteryCapacityWh} Wh
            </strong></span>
          </div>
        </div>

        {/* 4. Communication & Storage */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase">
                <Radio className="w-4 h-4" /> Data & Storage
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                communication.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {communication.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <span className="text-2xl font-bold text-white">{communication.metrics?.effectiveDownlinkRateMbps}</span>
              <span className="text-xs text-slate-400">Mbps Downlink</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  communication.metrics?.hasStorageOverflow ? 'bg-rose-500' : 'bg-indigo-400'
                }`}
                style={{ width: `${Math.min(100, communication.metrics?.storageUtilizationPct || 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Gen: <strong className="text-slate-200">{communication.metrics?.generatedDataGB} GB</strong></span>
            <span>Memory: <strong className="text-slate-200">{communication.metrics?.totalStorageGB} GB</strong></span>
            <span>Backlog: <strong className={communication.metrics?.hasStorageOverflow ? 'text-rose-400' : 'text-slate-200'}>
              {communication.metrics?.unbufferedDataGB} GB
            </strong></span>
          </div>
        </div>

        {/* 5. Financial Mission Budget */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-teal-400 font-bold uppercase">
                <DollarSign className="w-4 h-4" /> Mission Budget
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                budget.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {budget.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <span className="text-2xl font-bold text-white">${(budget.metrics?.totalCost / 1000).toFixed(0)}k</span>
              <span className="text-xs text-slate-400">/ ${(budget.metrics?.maxBudget / 1000).toFixed(0)}k</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  budget.metrics?.isWithinBudget ? 'bg-teal-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, budget.metrics?.budgetUtilizationPct || 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Spent: <strong className="text-slate-200">{budget.metrics?.budgetUtilizationPct}%</strong></span>
            <span>Remaining: <strong className={budget.metrics?.remainingFunds < 0 ? 'text-rose-400' : 'text-emerald-400'}>
              ${(budget.metrics?.remainingFunds / 1000).toFixed(0)}k
            </strong></span>
          </div>
        </div>

        {/* 6. Scientific Payload Score */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-purple-400 font-bold uppercase">
                <Award className="w-4 h-4" /> Scientific Score
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                scientificScore >= targetScience ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {scientificScore >= targetScience ? 'TARGET MET' : 'DEFICIT'}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono my-1">
              <span className="text-2xl font-bold text-white">{scientificScore}</span>
              <span className="text-xs text-slate-400">/ {targetScience} pts target</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  scientificScore >= targetScience ? 'bg-purple-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, targetScience > 0 ? (scientificScore / targetScience) * 100 : 0)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Status: <strong className={scientificScore >= targetScience ? 'text-emerald-400' : 'text-amber-400'}>
              {scientificScore >= targetScience ? 'Objectives Satisfied' : 'Add Science Sensors'}
            </strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}