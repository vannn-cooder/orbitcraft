import React from 'react';
import { ShieldCheck, AlertTriangle, Lightbulb, Rocket, Wrench, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ValidationConsole({ validationResult, onLaunch }) {
  const isValid = Boolean(validationResult?.isValid);

  // Ambil daftar issue/error dari berbagai kemungkinan format
  const rawIssues = 
    validationResult?.issues ||
    validationResult?.errors ||
    validationResult?.reasons ||
    validationResult?.failures ||
    [];

  // Generator Petunjuk Komprehensif
  const generateClues = () => {
    if (isValid) {
      return [];
    }

    const clues = [];

    // 1. Ekstraksi dari daftar isu teks/objek jika ada
    if (Array.isArray(rawIssues) && rawIssues.length > 0) {
      rawIssues.forEach((item) => {
        const text = typeof item === 'string' ? item : (item?.message || item?.text || JSON.stringify(item));
        const lower = text.toLowerCase();

        if (lower.includes('bus') || lower.includes('struktur') || lower.includes('frame')) {
          clues.push({
            title: 'Struktur Inti Belum Ada',
            problem: text,
            hint: 'Buka kategori Bus di katalog dan pasang rangka satelit terlebih dahulu.'
          });
        } else if (lower.includes('mass') || lower.includes('massa') || lower.includes('berat') || lower.includes('weight')) {
          clues.push({
            title: 'Kelebihan Beban Peluncuran',
            problem: text,
            hint: 'Massa melebihi batas roket. Lepas modul sekunder atau gunakan bus yang lebih ringan.'
          });
        } else if (lower.includes('delta') || lower.includes('propulsi') || lower.includes('thruster') || lower.includes('vel')) {
          clues.push({
            title: 'Daya Dorong (Δv) Kurang',
            problem: text,
            hint: 'Pasang pendorong (Thruster) dengan Isp tinggi atau kurangi total bobot satelit.'
          });
        } else if (lower.includes('power') || lower.includes('daya') || lower.includes('eclipse') || lower.includes('baterai') || lower.includes('solar')) {
          clues.push({
            title: 'Defisit Daya / Blackout',
            problem: text,
            hint: 'Tambahkan panel surya dan baterai Li-Ion agar sistem menyala di fase gerhana.'
          });
        } else if (lower.includes('payload') || lower.includes('sensor') || lower.includes('instrumen') || lower.includes('camera')) {
          clues.push({
            title: 'Instrumen Sains Wajib Hilang',
            problem: text,
            hint: 'Pasang instrumen sains (kamera/spektrometer) sesuai briefing misi di atas.'
          });
        } else if (lower.includes('comm') || lower.includes('antena') || lower.includes('downlink') || lower.includes('radio')) {
          clues.push({
            title: 'Antena Komunikasi Belum Ada',
            problem: text,
            hint: 'Pasang antena komunikasi (S-Band/X-Band) untuk downlink data ke Bumi.'
          });
        } else {
          clues.push({
            title: 'Parameter Belum Memenuhi Syarat',
            problem: text,
            hint: 'Sesuaikan konfigurasi komponen agar memenuhi toleransi misi.'
          });
        }
      });
    }

    // 2. Evaluasi langsung dari metrik telemetri angka (jika ada di validationResult)
    if (validationResult) {
      if (validationResult.deltaV !== undefined && validationResult.targetDeltaV !== undefined) {
        if (validationResult.deltaV < validationResult.targetDeltaV && !clues.some(c => c.title.includes('Δv'))) {
          clues.push({
            title: 'Daya Dorong (Δv) Kurang',
            problem: `Δv saat ini (${Math.round(validationResult.deltaV)} m/s) di bawah target (${validationResult.targetDeltaV} m/s).`,
            hint: 'Pasang pendorong hidrazin atau ion engine di kategori Propulsion.'
          });
        }
      }

      if (validationResult.totalMass !== undefined && validationResult.maxMass !== undefined) {
        if (validationResult.totalMass > validationResult.maxMass && !clues.some(c => c.title.includes('Beban'))) {
          clues.push({
            title: 'Kelebihan Beban Roket',
            problem: `Massa (${Math.round(validationResult.totalMass)} kg) melebihi batas roket (${validationResult.maxMass} kg).`,
            hint: 'Gunakan komponen yang lebih ringan atau copot modul cadangan.'
          });
        }
      }
    }

    // 3. PANDUAN LANGKAH AWAL (Jika perakitan masih kosong atau baru dimulai)
    if (clues.length === 0) {
      clues.push(
        {
          title: 'Langkah 1: Pasang Bus (Rangka)',
          problem: 'Satelit membutuhkan bus utama untuk menampung modul lain.',
          hint: 'Pilih "MicroSat Bus" atau struktur rangka lain di katalog.'
        },
        {
          title: 'Langkah 2: Pasang Sensor Sains (Payload)',
          problem: 'Misi membutuhkan sensor pengamatan untuk mengumpulkan data.',
          hint: 'Buka tab Payload, lalu pasang instrumen yang diminta (misal: Optical Imager).'
        },
        {
          title: 'Langkah 3: Sistem Daya & Baterai',
          problem: 'Satelit butuh listrik saat terang dan saat berada di bayangan planet.',
          hint: 'Pasang "Deployable Solar Array" dan minimal 1 unit "Li-Ion Battery Pack".'
        },
        {
          title: 'Langkah 4: Pasang Propulsi & Antena',
          problem: 'Wahana butuh pendorong untuk manuver orbit dan antena untuk kirim data.',
          hint: 'Pasang "Hydrazine Thruster" di tab Propulsion dan antena di tab Communication.'
        }
      );
    }

    return clues;
  };

  const clues = generateClues();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
      {/* Header Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Automated Flight Readiness Review (FRR)
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Engineering Diagnostic & Flight Control
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
              isValid
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950/50'
                : 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-md shadow-rose-950/50'
            }`}
          >
            {isValid ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FLIGHT READY</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>ENGINEERING DEFICIT</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CLUE BOX (Kotak Petunjuk Rekayasa) */}
      {!isValid && (
        <div className="bg-amber-950/25 border border-amber-500/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Flight Director Advisory & Actionable Clues:</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300/70 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              {clues.length} Rekomendasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clues.map((clue, idx) => (
              <div
                key={idx}
                className="bg-slate-950/90 border border-amber-900/50 rounded-lg p-3 space-y-1.5 text-xs shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                  <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{clue.title}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {clue.problem}
                </p>
                <div className="bg-amber-950/50 border border-amber-700/40 rounded px-2.5 py-1.5 text-[11px] text-amber-200 font-mono flex items-start gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Solusi:</strong> {clue.hint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kondisi Jika Sudah Flight Ready */}
      {isValid && (
        <div className="bg-emerald-950/30 border border-emerald-600/40 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="text-emerald-300 font-bold font-mono">Seluruh Subsistem Telah Siap (Nominal)</p>
            <p className="text-slate-300 text-[11px]">
              Wahana antariksa memenuhi seluruh parameter kontrak misi (Massa, Daya, $\Delta v$, Komunikasi, dan Instrumen).
            </p>
          </div>
        </div>
      )}

      {/* Tombol Eksekusi Peluncuran */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!isValid}
          onClick={onLaunch}
          className={`w-full py-3.5 px-6 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            isValid
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-950 cursor-pointer animate-pulse'
              : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Rocket className="w-5 h-5" />
          <span>{isValid ? 'LAUNCH MISSION SIMULATION' : 'LAUNCH LOCKED — RESOLVE DEFICIT FIRST'}</span>
        </button>
      </div>
    </div>
  );
}