import React, { useState, useEffect } from 'react';
import { Rocket, Cpu, Radio, ShieldCheck, Terminal } from 'lucide-react';

export default function BootSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const logs = [
    { text: 'INITIALIZING KEPLERIAN TRAJECTORY ENGINE...', icon: Cpu },
    { text: 'ESTABLISHING DEEP SPACE NETWORK (DSN) LINK...', icon: Radio },
    { text: 'CALIBRATING AVIONICS & POWER DISTRIBUTION BUS...', icon: Terminal },
    { text: 'SYNCING SUPABASE GLOBAL FLIGHT TELEMETRY...', icon: Rocket },
    { text: 'FLIGHT READINESS REVIEW: ALL SYSTEMS NOMINAL.', icon: ShieldCheck }
  ];

  useEffect(() => {
    // Timer progres 0% - 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 400); // Selesai & masuk ke workbench
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    // Pergantian teks log setiap progres naik
    const logIndex = Math.min(
      Math.floor((progress / 100) * logs.length),
      logs.length - 1
    );
    setCurrentLogIndex(logIndex);
  }, [progress, logs.length]);

  const CurrentIcon = logs[currentLogIndex].icon;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-mono select-none">
      
      {/* Efek Garis Radar Latar Belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 flex flex-col items-center space-y-6">
        
        {/* Logo & Judul Proyek */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            <Rocket className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] px-2 py-0.5 rounded-full uppercase">
            v2.6
          </span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-widest text-white">
            ORBITCRAFT
          </h1>
          <p className="text-xs text-cyan-400 tracking-wider">
            MODULAR SYSTEMS ARCHITECT
          </p>
          <p className="text-[10px] text-slate-500">
            NASA Space Apps Challenge 2026 — Team Bhapp
          </p>
        </div>

        {/* Progress Bar Persentase */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <CurrentIcon className="w-3.5 h-3.5 animate-spin" />
              <span>BOOT SEQUENCE</span>
            </span>
            <span className="font-bold text-white text-sm">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Teks Status Log Telemetri */}
        <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 text-left min-h-[58px] flex items-center shadow-inner">
          <span className="text-[11px] text-slate-300 leading-snug">
            <span className="text-cyan-400 mr-2">&gt;</span>
            {logs[currentLogIndex].text}
          </span>
        </div>

        {/* Tombol Lewati (Skip) */}
        <button
          type="button"
          onClick={onComplete}
          className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest underline decoration-slate-700 underline-offset-4 cursor-pointer"
        >
          [ Bypass Initialization ]
        </button>

      </div>
    </div>
  );
}