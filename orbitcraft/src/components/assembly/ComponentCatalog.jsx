import React, { useState } from 'react';
import { Layers, Zap, Gauge, Plus, Sparkles, CheckCircle2, Award, ChevronDown, ChevronUp, BatteryCharging, Radio, Cpu } from 'lucide-react';
import { playClickSound, playQuindarTone } from '../../utils/audio.js';

export default function ComponentCatalog({ components = [], onAddComponent, onClearAll }) {
  const [activeBlueprint, setActiveBlueprint] = useState(null);
  const [showJudgeClue, setShowJudgeClue] = useState(true);

  // Preset Blueprint Historis NASA
  const presets = [
    {
      id: 'voyager',
      name: 'Voyager 1',
      tag: 'Deep Space Probe',
      keywords: ['bus', 'avionics', 'rtg', 'nuclear', 'battery', 'antenna', 'probe', 'camera', 'hydrazine', 'sensor', 'science']
    },
    {
      id: 'artemis',
      name: 'Artemis Orion',
      tag: 'Lunar Crewed',
      keywords: ['bus', 'battery', 'capsule', 'command', 'avionics', 'crew', 'solar', 'cryogenic', 'service', 'life', 'thruster']
    },
    {
      id: 'jwst',
      name: 'JWST Spec',
      tag: 'Deep Space Optics',
      keywords: ['bus', 'battery', 'optics', 'shield', 'avionics', 'ion', 'array', 'thermal', 'radiator']
    }
  ];

  const safeStr = (val) => (val !== null && val !== undefined ? String(val).toLowerCase() : '');

  const handleApplyPreset = (preset) => {
    try { playQuindarTone(2475); } catch {}
    if (!components || components.length === 0) return;

    const matched = [];
    preset.keywords.forEach((kw) => {
      const found = components.find((c) => {
        const alreadyPicked = matched.some((m) => m.id === c.id);
        const nameMatch = safeStr(c.name).includes(kw);
        const catMatch = safeStr(c.category).includes(kw) || safeStr(c.type).includes(kw);
        const idMatch = safeStr(c.id).includes(kw);
        const descMatch = safeStr(c.description).includes(kw);
        return !alreadyPicked && (nameMatch || catMatch || idMatch || descMatch);
      });
      if (found) matched.push(found);
    });

    if (matched.length < 3) {
      components.forEach((c) => {
        if (matched.length < 4 && !matched.some((m) => m.id === c.id)) {
          matched.push(c);
        }
      });
    }

    if (onClearAll) onClearAll();

    setActiveBlueprint(preset.name);
    setTimeout(() => setActiveBlueprint(null), 2500);

    setTimeout(() => {
      matched.forEach((comp, idx) => {
        setTimeout(() => {
          if (onAddComponent) onAddComponent(comp);
        }, idx * 100);
      });
    }, 150);
  };

  // SHORTCUT LEVEL 1: KHUSUS 7 MODUL PILIHAN (DENGAN RAD750 OBC)
  const handleApplyLevel1Clue = () => {
    try { playQuindarTone(2800); } catch {}
    if (!components || components.length === 0) return;

    if (onClearAll) onClearAll();

    const selectedBuild = [];
    const addIfAvailable = (comp) => {
      if (comp && !selectedBuild.some((m) => m.id === comp.id)) {
        selectedBuild.push(comp);
      }
    };

    // 1. Bus: Mini (Mini Satellite Bus)
    const miniBus = components.find(
      (c) => (safeStr(c.category) === 'bus' || safeStr(c.id).includes('bus') || safeStr(c.name).includes('bus')) &&
             (safeStr(c.name).includes('mini') || safeStr(c.id).includes('mini') || safeStr(c.name).includes('small') || safeStr(c.id).includes('cubesat'))
    ) || components.find((c) => safeStr(c.category) === 'bus' || safeStr(c.id).includes('bus'));
    addIfAvailable(miniBus);

    // 2. Subsystem / Avionics: Radiation-Hardened Onboard Computer (RAD750 OBC)
    const rad750OBC = components.find(
      (c) => safeStr(c.name).includes('rad750') ||
             safeStr(c.id).includes('rad750') ||
             safeStr(c.name).includes('radiation-hardened onboard computer') ||
             (safeStr(c.name).includes('radiation') && safeStr(c.name).includes('computer')) ||
             (safeStr(c.category) === 'avionics' && safeStr(c.name).includes('hardened'))
    ) || components.find(
      (c) => safeStr(c.category) === 'avionics' || safeStr(c.id).includes('avionics') || safeStr(c.id).includes('obc')
    );
    addIfAvailable(rad750OBC);

    // 3. Power: Small Deployable (Small Deployable Solar Array)
    const smallDeployableSolar = components.find(
      (c) => (safeStr(c.category) === 'power' || safeStr(c.id).includes('solar') || safeStr(c.name).includes('solar')) &&
             (safeStr(c.name).includes('small deployable') || safeStr(c.id).includes('solar_small') || (safeStr(c.name).includes('deployable') && safeStr(c.name).includes('small')))
    ) || components.find((c) => (safeStr(c.category) === 'power' && Number(c.power) > 0) || safeStr(c.id).includes('solar'));
    addIfAvailable(smallDeployableSolar);

    // 4. Battery: Standard Aerospace Battery
    const standardBattery = components.find(
      (c) => (safeStr(c.id).includes('battery') || safeStr(c.name).includes('battery')) &&
             (safeStr(c.name).includes('standard') || safeStr(c.name).includes('aerospace') || safeStr(c.id).includes('battery_aerospace') || safeStr(c.id).includes('battery_standard'))
    ) || components.find((c) => safeStr(c.id).includes('battery') || safeStr(c.name).includes('battery'));
    addIfAvailable(standardBattery);

    // 5. Propulsion: Monopropellant (Monopropellant Propulsion System)
    const monopropThruster = components.find(
      (c) => (safeStr(c.category) === 'propulsion' || safeStr(c.id).includes('prop') || safeStr(c.name).includes('thruster')) &&
             (safeStr(c.name).includes('monoprop') || safeStr(c.id).includes('monoprop') || safeStr(c.name).includes('hydrazine'))
    ) || components.find((c) => safeStr(c.category) === 'propulsion' || safeStr(c.id).includes('prop'));
    addIfAvailable(monopropThruster);

    // 6. Communication: X-Band (X-Band Transceiver / Antenna)
    const xBandComm = components.find(
      (c) => (safeStr(c.category) === 'communication' || safeStr(c.id).includes('comm') || safeStr(c.name).includes('antenna')) &&
             (safeStr(c.name).includes('x-band') || safeStr(c.name).includes('x band') || safeStr(c.id).includes('xband') || safeStr(c.id).includes('x_band'))
    ) || components.find((c) => safeStr(c.category) === 'communication' || safeStr(c.id).includes('comm'));
    addIfAvailable(xBandComm);

    // 7. Payload: Multispectral (Multispectral Imager / Sensor)
    const multispectralPayload = components.find(
      (c) => (safeStr(c.category) === 'payload' || safeStr(c.id).includes('payload')) &&
             (safeStr(c.name).includes('multispectral') || safeStr(c.id).includes('multispectral') || safeStr(c.name).includes('hyperspectral') || safeStr(c.id).includes('hyperspectral'))
    ) || components.find((c) => safeStr(c.category) === 'payload' || safeStr(c.id).includes('payload'));
    addIfAvailable(multispectralPayload);

    console.log('[OrbitCraft] Memasang arsitektur Level 1 pilihan:', selectedBuild.map((b) => b.name || b.id));

    setActiveBlueprint('RAD750 Multispectral Orbit Spec');
    setTimeout(() => setActiveBlueprint(null), 2500);

    setTimeout(() => {
      selectedBuild.forEach((comp, idx) => {
        setTimeout(() => {
          if (onAddComponent) onAddComponent(comp);
        }, idx * 100);
      });
    }, 150);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 font-sans">
      
      {/* Header & NASA Blueprints Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wider font-mono">
              COMPONENT CATALOG
            </h2>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Available Avionics & Subsystem Modules
          </p>
        </div>

        {/* Tombol Preset Blueprint */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-cyan-400 uppercase flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 text-cyan-300" /> Blueprints:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* CLUE KHUSUS JURI EVALUASI NASA */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 rounded-xl p-3 shadow-lg font-mono">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                NASA JUDGES DOSSIER • MISSION 1 ARCHITECTURE SPEC
              </span>
              <span className="text-[10px] text-slate-400 block font-normal">
                Mini Bus + RAD750 OBC + Small Deployable + Aerospace Battery + Monopropellant + X-Band + Multispectral
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleApplyLevel1Clue}
              className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-2.5 py-1 rounded shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load L1 Spec (Auto Valid)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowJudgeClue(!showJudgeClue)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showJudgeClue ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showJudgeClue && (
          <div className="mt-2.5 pt-2 border-t border-amber-500/20 text-[10px] text-slate-300 space-y-1.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 py-1">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-amber-400 block font-bold">1. Bus & Avionics</span>
                <span>Mini Satellite Bus + RAD750 OBC.</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-cyan-400 block font-bold flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-cyan-300" />
                  2. Power & Battery
                </span>
                <span>Small Deployable Solar + Aerospace Battery.</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-purple-400 block font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-purple-300" />
                  3. Propulsion & X-Band
                </span>
                <span>Monopropellant Thruster + X-Band Link.</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-emerald-400 block font-bold">4. Science Payload</span>
                <span>Multispectral Imager (LEO Observation).</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 italic">
              *Klik tombol emas <strong>Load L1 Spec (Auto Valid)</strong> di atas untuk memasang tepat 7 subsistem ini secara otomatis.
            </p>
          </div>
        )}
      </div>

      {/* Banner Notifikasi Pemasangan Berhasil */}
      {activeBlueprint && (
        <div className="py-2 px-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Konfigurasi <strong>{activeBlueprint}</strong> berhasil dirakit ke slot wahana.</span>
        </div>
      )}

      {/* Grid Komponen Katalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
        {components.map((comp) => (
          <div
            key={comp.id}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors font-mono">
                  {comp.name}
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {comp.category || comp.type || 'Module'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {comp.description || 'Aerospace-grade subsystem module.'}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  {comp.mass || 0} kg
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  {(comp.power || 0) > 0 ? `+${comp.power}` : (comp.power || 0)} W
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  try { playClickSound(); } catch {}
                  if (onAddComponent) {
                    onAddComponent(comp);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>INSTALL</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}