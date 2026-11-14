import React from 'react';
import { Box, Zap, Flame, Radio, Cpu, ShieldCheck } from 'lucide-react';

export default function SpacecraftSchematic({ selectedComponents = [] }) {
  const bus = selectedComponents.find((c) => c.category === 'bus');
  const solarModules = selectedComponents.filter((c) => c.category === 'power' && c.solarDependent);
  const rtgModules = selectedComponents.filter((c) => c.category === 'power' && !c.solarDependent && c.subCategory !== 'battery');
  const batteries = selectedComponents.filter((c) => c.category === 'power' && c.subCategory === 'battery');
  const thrusters = selectedComponents.filter((c) => c.category === 'propulsion');
  const antennas = selectedComponents.filter((c) => c.category === 'communication');
  const payloads = selectedComponents.filter((c) => c.category === 'payload');

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]">
      {/* Background CAD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Blueprint Title */}
      <div className="absolute top-3 left-3 text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Schematic CAD Cross-Section</span>
      </div>

      {!bus ? (
        <div className="text-center font-mono text-xs text-slate-500 z-10">
          <p className="text-slate-400 font-semibold mb-1">Struktur Belum Ada</p>
          <p className="text-[11px]">Pasang Spacecraft Bus untuk memulai proyeksi skematik.</p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xs py-4">
          
          {/* Top: Communication Antenna Array */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {antennas.length > 0 ? (
              antennas.map((ant, idx) => (
                <div
                  key={idx}
                  title={`Antenna: ${ant.name}`}
                  className="p-1.5 bg-indigo-950/80 border border-indigo-500/60 rounded-t-lg text-indigo-300 flex flex-col items-center text-[10px] font-mono shadow-md"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span className="text-[8px] truncate max-w-[60px]">{ant.name.split(' ')[0]}</span>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-slate-700 rounded px-2 py-0.5 text-[9px] font-mono text-slate-500">
                No Antenna
              </div>
            )}
          </div>

          {/* Middle Row: Left Solar Wing - Central Bus - Right Solar Wing */}
          <div className="flex items-center justify-center w-full gap-2">
            
            {/* Left Solar Panel */}
            <div className="flex-1 flex justify-end">
              {solarModules.length > 0 ? (
                <div className="h-20 w-14 bg-gradient-to-r from-blue-900 to-cyan-900 border border-cyan-400/60 rounded flex flex-col justify-between p-1 shadow-lg shadow-cyan-950/50">
                  <div className="border-b border-cyan-500/40 w-full" />
                  <div className="border-b border-cyan-500/40 w-full" />
                  <div className="text-[8px] font-mono text-cyan-200 text-center font-bold">SOLAR</div>
                  <div className="border-b border-cyan-500/40 w-full" />
                </div>
              ) : (
                <div className="h-16 w-10 border border-dashed border-slate-800 rounded flex items-center justify-center text-[8px] font-mono text-slate-600">
                  Panel L
                </div>
              )}
            </div>

            {/* Central Bus Core Structure */}
            <div className="w-32 min-h-[100px] bg-slate-900 border-2 border-cyan-500/70 rounded-xl p-2.5 flex flex-col justify-between shadow-xl shadow-cyan-950/40 text-center">
              <div>
                <span className="text-[9px] font-mono uppercase px-1 rounded bg-slate-800 text-cyan-300 font-bold">
                  {bus.id.replace('bus_', '').toUpperCase()} BUS
                </span>
                <p className="text-[10px] font-bold text-white mt-1 truncate">
                  {bus.name.split('(')[0]}
                </p>
              </div>

              {/* Internal Subsystem Indicators */}
              <div className="grid grid-cols-2 gap-1 my-1.5">
                <div className={`p-1 rounded text-[8px] font-mono ${batteries.length > 0 ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-slate-950 text-slate-600 border border-slate-850'}`}>
                  BAT: {batteries.length}x
                </div>
                <div className={`p-1 rounded text-[8px] font-mono ${rtgModules.length > 0 ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-slate-950 text-slate-600 border border-slate-850'}`}>
                  RTG: {rtgModules.length}x
                </div>
              </div>

              {/* Installed Payload Badge Count */}
              <div className="text-[9px] font-mono text-purple-300 bg-purple-950/50 border border-purple-800/60 rounded py-0.5">
                {payloads.length} Sensors Active
              </div>
            </div>

            {/* Right Solar Panel */}
            <div className="flex-1 flex justify-start">
              {solarModules.length > 0 ? (
                <div className="h-20 w-14 bg-gradient-to-l from-blue-900 to-cyan-900 border border-cyan-400/60 rounded flex flex-col justify-between p-1 shadow-lg shadow-cyan-950/50">
                  <div className="border-b border-cyan-500/40 w-full" />
                  <div className="border-b border-cyan-500/40 w-full" />
                  <div className="text-[8px] font-mono text-cyan-200 text-center font-bold">SOLAR</div>
                  <div className="border-b border-cyan-500/40 w-full" />
                </div>
              ) : (
                <div className="h-16 w-10 border border-dashed border-slate-800 rounded flex items-center justify-center text-[8px] font-mono text-slate-600">
                  Panel R
                </div>
              )}
            </div>

          </div>

          {/* Bottom: Propulsion Thruster Bells */}
          <div className="flex items-center justify-center gap-3 mt-2">
            {thrusters.length > 0 ? (
              thrusters.map((th, idx) => (
                <div
                  key={idx}
                  title={`Propulsion: ${th.name}`}
                  className="p-1.5 bg-emerald-950/80 border border-emerald-500/60 rounded-b-lg text-emerald-300 flex flex-col items-center text-[10px] font-mono shadow-md"
                >
                  <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span className="text-[8px]">{th.ispSeconds}s Isp</span>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-slate-700 rounded px-2 py-0.5 text-[9px] font-mono text-slate-500">
                No Propulsion
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}