import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Orbit, 
  Zap, 
  Radio, 
  Weight, 
  DollarSign, 
  RotateCcw, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function PostMissionDebrief({
  isOpen,
  mission,
  validationResult,
  onContinue,
  onReconfigure
}) {
  if (!isOpen || !mission || !validationResult) return null;

  const isSuccess = validationResult.isValid;
  const { subsystems, scientificScore, targetScientificValue } = validationResult;
  const { mass, propulsion, power, communication, budget } = subsystems || {};

  // Formulate engineering recommendations based on performance telemetry
  const recommendations = [];

  if (mass?.metrics?.remainingMarginKg < 15 && mass?.metrics?.remainingMarginKg >= 0) {
    recommendations.push(
      'Margin massa sangat tipis (< 15 kg). Pertimbangkan modul berbahan serat karbon pada misi ber-Delta-v lebih tinggi.'
    );
  }
  if (propulsion?.metrics?.deltaVMargin > 500) {
    recommendations.push(
      'Surplus Delta-v sangat tinggi. Anda dapat mengefisiensikan massa propelan untuk membawa instrumen sains tambahan.'
    );
  }
  if (power?.metrics?.batteryUtilizationPct > 80) {
    recommendations.push(
      'Kedalaman pengosongan baterai (DoD) mendekati 80% saat gerhana. Tambahkan modul baterai ekstra untuk umur misi yang lebih panjang.'
    );
  }
  if (communication?.metrics?.unbufferedDataGB > 0) {
    recommendations.push(
      'Terdapat akumulasi data backlog di memori. Tambahkan modul SSR-64GB atau antena ber-gain lebih tinggi.'
    );
  }
  if (budget?.metrics?.remainingFunds > 200000) {
    recommendations.push(
      'Sisa anggaran pengadaan melimpah. Manfaatkan dana cadangan untuk sensor sains beresolusi lebih tinggi.'
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Arsitektur wahana antariksa berada pada kesetimbangan rekayasa optimal (*Golden Compromise*).'
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        
        {/* Banner Header */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex p-3 rounded-2xl mb-3 shadow-lg ${
            isSuccess ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-emerald-950/60' : 'bg-rose-950 text-rose-400 border border-rose-500/40 shadow-rose-950/60'
          }">
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-400" />
            )}
          </div>

          <span className="block text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            Flight Readiness & Post-Mission Analysis
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {isSuccess ? 'MISSION CONTRACT COMPLETED' : 'MISSION COMPROMISED'}
          </h2>
          <p className="text-sm font-mono text-cyan-400 mt-1">
            {mission.name}
          </p>
        </div>

        {/* Scientific Score & Efficiency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">Scientific Yield</span>
            <div className="text-2xl font-bold font-mono text-purple-400 flex items-center justify-center gap-1">
              <Award className="w-5 h-5" />
              <span>{scientificScore} / {targetScientificValue}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">Science Objectives</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">Delta-v Margin</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
              <Orbit className="w-5 h-5" />
              <span>+{propulsion?.metrics?.deltaVMargin}</span>
              <span className="text-xs text-slate-400">m/s</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">Orbital Reserve</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-400 block mb-1">Budget Efficiency</span>
            <div className="text-2xl font-bold font-mono text-teal-400 flex items-center justify-center gap-1">
              <DollarSign className="w-5 h-5" />
              <span>{budget?.metrics?.budgetUtilizationPct}%</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">${(budget?.metrics?.remainingFunds / 1000).toFixed(0)}k Saved</span>
          </div>
        </div>

        {/* Subsystem Telemetry Breakdown */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Subsystem Engineering Audit
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {/* Mass */}
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Weight className="w-4 h-4 text-sky-400" /> Mass Budget
              </span>
              <span className={mass?.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                {mass?.metrics?.totalMassKg} kg / {mass?.metrics?.maxCapacityKg} kg ({mass?.status})
              </span>
            </div>

            {/* Propulsion */}
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Orbit className="w-4 h-4 text-emerald-400" /> Propulsion (Tsiolkovsky)
              </span>
              <span className={propulsion?.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                {propulsion?.metrics?.availableDeltaV} m/s / {propulsion?.metrics?.requiredDeltaV} m/s ({propulsion?.status})
              </span>
            </div>

            {/* Power */}
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" /> Power & Eclipse Storage
              </span>
              <span className={power?.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                {power?.metrics?.daylightNetMarginW} W Net | {power?.metrics?.totalBatteryCapacityWh} Wh ({power?.status})
              </span>
            </div>

            {/* Comm */}
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="flex items-center gap-2 text-slate-300">
                <Radio className="w-4 h-4 text-indigo-400" /> Data Transmission
              </span>
              <span className={communication?.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                {communication?.metrics?.effectiveDownlinkRateMbps} Mbps ({communication?.status})
              </span>
            </div>
          </div>
        </div>

        {/* Engineering Recommendations Box */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Flight Review Board Recommendations
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">›</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onReconfigure}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-lg font-mono text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Assembly Bay</span>
          </button>

          {isSuccess && (
            <button
              onClick={onContinue}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white px-6 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/60 transition-all"
            >
              <span>Accept Contract & Advance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}