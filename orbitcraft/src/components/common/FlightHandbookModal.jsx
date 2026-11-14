import React from 'react';
import { BookOpen, X, Orbit, Zap, Weight, Radio, Scale } from 'lucide-react';

export default function FlightHandbookModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative my-8 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 text-cyan-400">
            <div className="p-2 bg-cyan-950 rounded-lg border border-cyan-800">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Spacecraft Systems Engineering Flight Handbook
              </h2>
              <p className="text-xs font-mono text-slate-400">
                NASA Space Apps Challenge 2026 — Foundational Aerospace Trade-Off Physics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Topics */}
        <div className="space-y-4 font-mono text-xs max-h-[520px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Section 1: Mass Budget */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 font-bold mb-1.5 text-sm">
              <Weight className="w-4 h-4" />
              <span>1. Structural Mass and Launch Vehicle Payload Margins</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs mb-2">
              Dalam arsitektur misi antariksa, massa basah awal wahana terdiri dari massa kering (dry mass) seluruh instrumen ditambah massa propelan cadangan. Melebihi kapasitas kargo roket peluncur berakibat kegagalan total peluncuran (Launch Abort).
            </p>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-sky-300">
              <code>Total Wet Mass = Dry Mass (Bus + Payload + Avionics) + Propellant Mass</code>
            </div>
          </div>

          {/* Section 2: Tsiolkovsky Equation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5 text-sm">
              <Orbit className="w-4 h-4" />
              <span>2. Orbital Mechanics: Tsiolkovsky Rocket Equation</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs mb-2">
              Perubahan kecepatan orbital (Delta-v) yang dibutuhkan untuk transfer Hohmann atau penyisipan orbit diatur oleh persamaan Tsiolkovsky. Mesin dengan Specific Impulse (Isp) tinggi menghemat massa propelan, namun memerlukan pasokan daya listrik yang signifikan.
            </p>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-emerald-300">
              <code>Delta-v = Isp * g0 * ln(m0 / mf)</code>
              <span className="block text-[10px] text-slate-400 mt-1">Konstanta gravitasi standar g0 = 9.80665 m/s2; mf = massa kering wahana sesudah propelan habis.</span>
            </div>
          </div>

          {/* Section 3: Solar Flux & Eclipse */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5 text-sm">
              <Zap className="w-4 h-4" />
              <span>3. Power Equilibrium, Eclipse and Inverse-Square Law</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs mb-2">
              Fluks radiasi matahari menyusut drastis mengikuti hukum kuadrat terbalik (1 per r kuadrat). Di orbit Mars (1.52 AU) daya panel turun menjadi sekitar 43 persen, dan di Jupiter (5.2 AU) hanya tersisa sekitar 4 persen sehingga mewajibkan modul RTG nuklir. Baterai Li-Ion wajib mencukupi konsumsi seluruh beban saat fase gerhana gelap.
            </p>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-amber-300">
              <code>E_battery_required = (P_load - P_rtg) * t_eclipse (Wh)</code>
            </div>
          </div>

          {/* Section 4: Telemetry Link */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1.5 text-sm">
              <Radio className="w-4 h-4" />
              <span>4. RF Communication and Solid-State Data Buffering</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs mb-2">
              Laju transmisi telemetri (downlink) dibatasi oleh diameter antena dan jarak stasiun bumi. Jika instrumen sains memproduksi data melebihi laju transmisi selama jendela kontak ground station, sisa data harus ditampung di memori Solid-State Recorder (SSR) agar tidak terjadi data overflow.
            </p>
          </div>

          {/* Section 5: Trade-offs */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1.5 text-sm">
              <Scale className="w-4 h-4" />
              <span>5. The Spacecraft Systems Engineering Balance</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              Merancang wahana antariksa bukanlah memilih modul termahal, melainkan menyeimbangkan 5 batasan sekaligus: Massa, Delta-v, Daya, Data, dan Biaya Kontrak. Setiap penambahan sensor sains menuntut kompensasi massa struktur, daya listrik, dan kapasitas baterai.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Compliant with NASA Systems Engineering Handbook (SP-2016-6105)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-mono text-xs transition-colors shadow-md"
          >
            Tutup Buku Panduan
          </button>
        </div>

      </div>
    </div>
  );
}