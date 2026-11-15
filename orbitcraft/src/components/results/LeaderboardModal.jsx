import React, { useState, useEffect } from 'react';
import { Trophy, X, Calendar, Rocket, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';

export default function LeaderboardModal({ isOpen, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchScores = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Supabase Error:', error);
        setErrorMessage(error.message || 'Gagal memuat data dari Supabase.');
      } else if (data && data.length > 0) {
        setLeaderboard(data);
      } else {
        setLeaderboard([]);
      }
    } catch (err) {
      console.error('Fetch Catch Error:', err);
      setErrorMessage(err.message || 'Koneksi ke Supabase gagal. Periksa URL dan Anon Key di src/lib/supabase.js');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScores();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col text-slate-100 max-h-[85vh]">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">FLIGHT TELEMETRY LEADERBOARD</h3>
              <p className="text-[11px] font-mono text-slate-400">Supabase Cloud Database</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifikasi Error jika ada kendala koneksi */}
        {errorMessage && (
          <div className="my-3 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-rose-200">Kendala Database:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Isi Daftar Peringkat */}
        <div className="overflow-y-auto my-4 space-y-2.5 pr-1 min-h-[160px] flex flex-col justify-center">
          {loading ? (
            <div className="text-center py-8 text-cyan-400 font-mono text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Menghubungkan ke satelit Supabase...</span>
            </div>
          ) : leaderboard.length === 0 && !errorMessage ? (
            <div className="text-center py-8 px-4 text-slate-500 font-mono">
              <Rocket className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tabel Supabase Masih Kosong</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Tabel 'leaderboard' terhubung, tetapi belum ada data baris yang tersimpan.
              </p>
            </div>
          ) : (
            leaderboard.map((item, index) => (
              <div
                key={item.id || index}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                  index === 0
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : index === 1
                    ? 'bg-slate-800/60 border-slate-400/30 text-slate-200'
                    : index === 2
                    ? 'bg-amber-900/20 border-amber-700/30 text-amber-400'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-black text-sm">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{item.callsign || 'Flight Architect'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-cyan-400">{item.mission}</span>
                      <span>•</span>
                      <span>Δv: {item.delta_v || item.deltaV || 0} m/s</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-emerald-400 block">
                    {(item.score || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">PTS</span>
                  </span>
                  <span className="text-[9px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5" />
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Modal */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={fetchScores}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors text-[11px] font-mono cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors font-mono text-xs cursor-pointer"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
}