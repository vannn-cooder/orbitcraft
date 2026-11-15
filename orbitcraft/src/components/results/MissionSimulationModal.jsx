import React, { useState, useEffect } from 'react';
import { Rocket, AlertTriangle, ShieldCheck, CheckCircle2, Flame, Sun, Orbit } from 'lucide-react';
import { playThrusterRumble, playHazardAlarm, playQuindarTone } from '../../utils/audio.js';

export default function MissionSimulationModal({
  isOpen,
  mission,
  validationResult,
  onSimulationComplete
}) {
  const [progress, setProgress] = useState(0);
  const [activeHazard, setActiveHazard] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setActiveHazard(null);
      return;
    }

    // Mainkan suara gemuruh mesin roket saat meluncur
    playThrusterRumble(3.0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;

        // Pemicu Anomali Dinamis:
        // 1. Pada progres 35%: Badai Radiasi Matahari (Solar Flare)
        if (next === 35) {
          playHazardAlarm();
          setActiveHazard({
            title: 'SOLAR PARTICLE STORM DETECTED',
            desc: 'High geomagnetic flux. Avionics radiation shielding active.',
            icon: Sun,
            severity: 'warning'
          });
        }

        // 2. Pada progres 70%: Bayangan Gerhana Termal (Thermal Eclipse)
        if (next === 70) {
          playHazardAlarm();
          setActiveHazard({
            title: 'PLANETARY ECLIPSE TRANSIT',
            desc: 'Solar panel input 0W. Battery bus discharge nominal.',
            icon: Orbit,
            severity: 'caution'
          });
        }

        // Selesai
        if (next >= 100) {
          clearInterval(interval);
          playQuindarTone(2524);
          setTimeout(() => {
            onSimulationComplete();
          }, 600);
          return 100;
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen, onSimulationComplete]);

  if (!isOpen) return null;

  const HazardIcon = activeHazard?.icon || AlertTriangle;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col font-mono text-slate-100">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                FLIGHT TRAJECTORY IN EXECUTION
              </h3>
              <p className="text-[11px] text-cyan-400">
                Target: {mission?.name || 'Selected Destination'}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            T+{Math.round((progress / 100) * 420)}s
          </span>
        </div>

        {/* Visual Rocket & Orbit Animation */}
        <div className="my-6 relative py-6 flex flex-col items-center justify-center bg-slate-950/70 border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center relative">
              <Rocket className="w-8 h-8 text-cyan-400 transform -rotate-45 animate-bounce" />
              <Flame className="w-4 h-4 text-amber-500 absolute -bottom-1 -left-1 animate-pulse" />
            </div>

            <span className="text-2xl font-black text-white mt-3">
              {progress}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">
              Orbital Insertion Vector
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-4/5 h-2 bg-slate-900 border border-slate-800 rounded-full mt-4 overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Flight Hazard Alert Box */}
        {activeHazard ? (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2">
            <HazardIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-bold text-white uppercase flex items-center gap-2">
                <span>{activeHazard.title}</span>
                <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300 border border-amber-500/30">
                  REAL-TIME HAZARD
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {activeHazard.desc}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Flight Environment: Interplanetary medium nominal. No active debris.</span>
          </div>
        )}

        {/* Telemetry Status Bar */}
        <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Expended Delta-V</span>
            <span className="text-cyan-400 font-bold">
              {Math.round(((validationResult?.deltaV || 3200) * progress) / 100)} m/s
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Architecture Status</span>
            <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Nominal
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}