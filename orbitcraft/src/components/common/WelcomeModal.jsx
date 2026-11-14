import React, { useState } from 'react';
import { Rocket, User, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';

export default function WelcomeModal({ isOpen, onSubmitUsername, defaultUsername = '' }) {
  const [nameInput, setNameInput] = useState(defaultUsername);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Masukkan username atau nama panggilan arsitek.');
      return;
    }
    if (trimmed.length < 3) {
      setErrorMsg('Username minimal 3 karakter.');
      return;
    }
    onSubmitUsername(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative text-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-t-2xl" />

        {/* Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-950/50">
          <Rocket className="w-8 h-8 animate-bounce" />
        </div>

        {/* Title */}
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
          NASA Space Apps Challenge 2026
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1 mb-2">
          OrbitCraft Mission Control
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Selamat datang di simulator perancangan sistem antariksa modular. Masukkan nama atau <span className="text-cyan-300 font-mono">Call Sign</span> arsitek Anda untuk mencatat skor misi ke Leaderboard.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architect Call Sign (Username)</span>
            </label>
            <input
              type="text"
              autoFocus
              maxLength={18}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Contoh: AstroKranz / Commander-9"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {errorMsg && (
              <p className="text-rose-400 text-xs font-mono mt-1.5">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-400 flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Skor efisiensi $\Delta v$, massa, dan sisa anggaran akan dicatat atas nama ini.</span>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-sm rounded-lg shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 group transition-all"
          >
            <span>START SIMULATION</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

      </div>
    </div>
  );
}