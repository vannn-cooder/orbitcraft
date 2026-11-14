import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Flame, Orbit, Radio, Zap, Volume2, VolumeX, Terminal, ShieldAlert } from 'lucide-react';

export default function MissionSimulationModal({
  isOpen,
  mission,
  validationResult,
  onSimulationComplete
}) {
  const [phase, setPhase] = useState(0); 
  // 0: Pad, 1: Ascent/Max-Q, 2: Stage 1 Separation, 3: Fairing Jettison, 4: Orbit
  const [altitude, setAltitude] = useState(0); 
  const [velocity, setVelocity] = useState(0); 
  const [gForce, setGForce] = useState(1.0); 
  const [isMaxQ, setIsMaxQ] = useState(false);
  const [logs, setLogs] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);
  const soundNodesRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const startRocketSound = () => {
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const bassOsc = ctx.createOscillator();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(55, ctx.currentTime);
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(120, ctx.currentTime);
      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
      bassOsc.connect(bassFilter); bassFilter.connect(bassGain); bassGain.connect(masterGain);
      bassOsc.start();

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(280, ctx.currentTime);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
      whiteNoise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(masterGain);
      whiteNoise.start();

      soundNodesRef.current = { ctx, masterGain, bassOsc, whiteNoise };
    } catch (e) {}
  };

  const playBeep = (freq = 880, duration = 0.08) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const stopRocketSound = () => {
    if (soundNodesRef.current) {
      try {
        const { masterGain, bassOsc, whiteNoise, ctx } = soundNodesRef.current;
        masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        setTimeout(() => { bassOsc?.stop(); whiteNoise?.stop(); soundNodesRef.current = null; }, 600);
      } catch {}
    }
  };

  const addLog = (text) => setLogs((prev) => [...prev.slice(-4), text]);

  useEffect(() => {
    if (!isOpen) {
      setPhase(0); setAltitude(0); setVelocity(0); setGForce(1.0);
      setIsMaxQ(false); setLogs([]); stopRocketSound();
      return;
    }

    if (soundEnabled) startRocketSound();

    addLog('T-03s: All flight controllers report GO.');
    playBeep(440, 0.1);

    const t1 = setTimeout(() => {
      setPhase(1); addLog('T+00s: Ignition. Liftoff confirmed.'); playBeep(880, 0.15);
    }, 1200);

    const t2 = setTimeout(() => {
      setIsMaxQ(true); addLog('T+15s: Vehicle is through Max-Q.');
    }, 2400);

    // Momen Pelepasan Stage 1 (Main Engine Cut Off)
    const t3 = setTimeout(() => {
      setIsMaxQ(false); setPhase(2); 
      addLog('T+35s: MECO. Stage 1 separation confirmed.');
      addLog('T+36s: Stage 2 vacuum engine ignition.');
      playBeep(659, 0.1);
    }, 3800);

    // Momen Pelepasan Fairing
    const t4 = setTimeout(() => {
      setPhase(3); addLog('T+45s: Altitude 110km. Fairing jettisoned.');
      playBeep(784, 0.1);
    }, 5200);

    // Satelit Mencapai Orbit
    const t5 = setTimeout(() => {
      setPhase(4); stopRocketSound(); addLog('T+80s: SECO. Orbit insertion nominal.');
      playBeep(1046, 0.25);
    }, 7400);

    const t6 = setTimeout(() => { onSimulationComplete(); }, 9500);

    const interval = setInterval(() => {
      setAltitude((prev) => (prev < 420 ? prev + Math.floor(Math.random() * 9 + 6) : 420));
      setVelocity((prev) => (prev < 7.8 ? +(prev + 0.09).toFixed(2) : 7.78));
      setGForce((prev) => {
        if (phase < 2 && prev < 3.8) return +(prev + 0.05).toFixed(2);
        if (phase === 2) return 1.2; // G-force drop saat mesin utama mati sementara
        if (phase === 3 && prev < 2.5) return +(prev + 0.03).toFixed(2);
        if (phase === 4) return 0.0; // Nol gravitasi di orbit
        return prev;
      });
    }, 100);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
      clearInterval(interval); stopRocketSound();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div onClick={() => { if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume(); }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold uppercase">{mission?.name} TELEMETRY</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={(e) => {
              e.stopPropagation();
              if (soundEnabled) { stopRocketSound(); setSoundEnabled(false); } 
              else { setSoundEnabled(true); startRocketSound(); }
            }} className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px] cursor-pointer bg-slate-800 px-2.5 py-1 rounded-md">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              <span>{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
            </button>
          </div>
        </div>

        {/* Viewport Layar Radar Simulasi */}
        <div className={`w-full h-72 rounded-xl my-4 relative overflow-hidden flex flex-col justify-end items-center border border-slate-800 transition-colors duration-1000 ${
          phase === 0 ? 'bg-gradient-to-t from-slate-900 via-sky-950 to-slate-950' :
          phase === 1 ? 'bg-gradient-to-t from-sky-950 via-slate-950 to-black' :
          'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black'
        }`}>

          {isMaxQ && (
            <div className="absolute top-4 right-4 bg-amber-950/80 border border-amber-500/80 text-amber-300 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 animate-pulse z-30">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>DYNAMIC PRESSURE (MAX-Q)</span>
            </div>
          )}

          {/* Animasi Kamera Mengikuti Roket */}
          <div className={`relative transition-all duration-700 flex flex-col items-center ${
            phase === 0 ? 'translate-y-2' : phase === 1 ? '-translate-y-10' : phase === 2 ? '-translate-y-16' : phase === 3 ? '-translate-y-20' : '-translate-y-16 scale-110'
          }`}>
            
            {phase < 4 ? (
              <div className="flex flex-col items-center relative z-20">
                
                {/* 1. Kapsul Payload / Fairing */}
                <div className="flex items-center gap-0.5 z-30 relative">
                  {/* Cangkang Kiri */}
                  <div className={`w-3.5 h-8 bg-slate-300 border border-slate-400 rounded-tl-full transition-transform duration-[1500ms] ${
                    phase >= 3 ? '-translate-x-12 translate-y-4 -rotate-[60deg] opacity-0' : ''
                  }`} />
                  {/* Satelit yang tadinya sembunyi di dalam */}
                  {phase >= 3 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-2 w-5 h-7 bg-cyan-950 border border-cyan-400 rounded-sm flex items-center justify-center animate-in fade-in zoom-in">
                      <Orbit className="w-3 h-3 text-cyan-300 animate-spin" />
                    </div>
                  )}
                  {/* Cangkang Kanan */}
                  <div className={`w-3.5 h-8 bg-slate-300 border border-slate-400 rounded-tr-full transition-transform duration-[1500ms] ${
                    phase >= 3 ? 'translate-x-12 translate-y-4 rotate-[60deg] opacity-0' : ''
                  }`} />
                </div>

                {/* 2. STAGE 2 (Upper Stage Vacuum) */}
                <div className="w-7 h-6 bg-slate-100 border-x border-t border-slate-400 flex flex-col justify-center items-center z-20 relative shadow-md">
                  <span className="text-[5px] font-bold text-slate-800 tracking-widest">S-II</span>
                  {/* Api Biru Vakum (Menyala saat phase 2 dan 3) */}
                  {phase >= 2 && (
                    <div className="absolute -bottom-5 flex flex-col items-center animate-bounce">
                      <Flame className="w-5 h-7 text-sky-300 fill-blue-500 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse" />
                    </div>
                  )}
                </div>

                {/* 3. STAGE 1 (Booster Utama Jatuh) */}
                <div className={`flex flex-col items-center transition-all duration-[2500ms] ease-in-out ${
                  phase >= 2 ? 'translate-y-48 opacity-0 rotate-12 scale-90' : ''
                }`}>
                  <div className="w-7 h-16 bg-slate-200 border border-slate-400 flex flex-col justify-between py-1.5 items-center shadow-inner">
                    <div className="w-4 h-0.5 bg-red-600 rounded-full" />
                    <span className="text-[7px] font-mono text-slate-800 rotate-90 font-black tracking-widest">NASA</span>
                    <div className="w-4 h-0.5 bg-blue-600 rounded-full" />
                  </div>
                  <div className="w-12 h-2.5 bg-slate-500 rounded-sm" />
                  
                  {/* Api Oranye Stage 1 */}
                  {phase < 2 && (
                    <div className="flex flex-col items-center animate-bounce -mt-1">
                      {/* Vacuum Plume Expansion: Api melebar seiring ketinggian di phase 1 */}
                      <Flame className={`text-amber-400 fill-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] animate-pulse transition-all duration-[2000ms] ${
                        phase === 1 ? 'w-10 h-14 scale-x-125' : 'w-8 h-10'
                      }`} />
                      <div className={`bg-gradient-to-b from-amber-400 via-orange-600 to-transparent rounded-full blur-[2px] -mt-4 transition-all duration-1000 ${
                        phase === 1 ? 'w-6 h-10' : 'w-4 h-8'
                      }`} />
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* FASE 4: Satelit Sukses Mengorbit Sendirian */
              <div className="flex items-center gap-2 animate-in zoom-in-75 duration-700">
                <div className="w-10 h-16 bg-gradient-to-r from-blue-950 to-cyan-900 border border-cyan-400 rounded flex flex-col justify-around p-0.5 shadow-lg">
                  <div className="border-b border-cyan-500/40 w-full" />
                  <div className="text-[7px] font-mono text-cyan-200 text-center font-bold">SOLAR</div>
                  <div className="border-b border-cyan-500/40 w-full" />
                </div>
                <div className="w-14 h-16 bg-slate-900 border-2 border-cyan-400 rounded-xl flex flex-col justify-center items-center shadow-2xl shadow-cyan-500/50">
                  <Orbit className="w-6 h-6 text-cyan-300 animate-spin" />
                  <span className="text-[8px] font-mono text-white font-bold mt-1">ONLINE</span>
                </div>
                <div className="w-10 h-16 bg-gradient-to-l from-blue-950 to-cyan-900 border border-cyan-400 rounded flex flex-col justify-around p-0.5 shadow-lg">
                  <div className="border-b border-cyan-500/40 w-full" />
                  <div className="text-[7px] font-mono text-cyan-200 text-center font-bold">SOLAR</div>
                  <div className="border-b border-cyan-500/40 w-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel Telemetri */}
        <div className="grid grid-cols-4 gap-2 mb-3 font-mono text-center">
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <span className="text-[9px] text-slate-500 block">ALTITUDE</span>
            <span className="text-sm font-bold text-cyan-400">{altitude} <span className="text-[10px] text-slate-400 font-normal">km</span></span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <span className="text-[9px] text-slate-500 block">VELOCITY</span>
            <span className="text-sm font-bold text-emerald-400">{velocity} <span className="text-[10px] text-slate-400 font-normal">km/s</span></span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <span className="text-[9px] text-slate-500 block">G-FORCE</span>
            <span className={`text-sm font-bold ${gForce > 3.0 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {gForce.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">G</span>
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <span className="text-[9px] text-slate-500 block">STAGE EVENT</span>
            <span className="text-[10px] font-bold text-sky-300 block truncate">
              {phase === 0 ? 'Ignition' : phase === 1 ? 'Boost Phase' : phase === 2 ? 'Staging (S1 Sep)' : phase === 3 ? 'Fairing Jettison' : 'Zero-G Coast'}
            </span>
          </div>
        </div>

        {/* Console Log */}
        <div className="bg-black border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-emerald-400 space-y-1 text-left min-h-[75px] shadow-inner">
          {logs.map((log, i) => (
            <p key={i} className="animate-in fade-in duration-200">
              <span className="text-slate-600 mr-1.5">&gt;</span>{log}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}