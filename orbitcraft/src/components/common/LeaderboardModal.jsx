import React from 'react';
import { Trophy, X, Medal } from 'lucide-react';

export default function LeaderboardModal({ isOpen, onClose, currentUser, currentScore = 0 }) {
  if (!isOpen) return null;

  const baseLeaderboard = [
    { rank: 1, name: 'Gene Kranz (Apollo FDIR)', score: 9850, mission: 'Jupiter Explorer' },
    { rank: 2, name: 'Margaret Hamilton', score: 9420, mission: 'Mars AeroSurvey' },
    { rank: 3, name: currentUser || 'Cadet Architect', score: Math.max(currentScore, 8750), mission: 'Active Session', isUser: true },
    { rank: 4, name: 'Katherine Johnson', score: 8640, mission: 'SeleneMapper' },
    { rank: 5, name: 'Wernher v. B.', score: 8120, mission: 'TerraWatch-1' },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3 text-amber-400">
            <div className="p-2 bg-amber-950/80 rounded-lg border border-amber-700/60">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Global Architect Leaderboard</h2>
              <p className="text-[11px] font-mono text-slate-400">Mission Efficiency & Systems Engineering Score</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Peringkat */}
        <div className="space-y-2">
          {baseLeaderboard.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                item.isUser
                  ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 text-center font-mono font-bold">
                  {index === 0 && <Medal className="w-5 h-5 text-amber-400 inline" />}
                  {index === 1 && <Medal className="w-5 h-5 text-slate-300 inline" />}
                  {index === 2 && <Medal className="w-5 h-5 text-amber-600 inline" />}
                  {index > 2 && <span className="text-xs text-slate-500">#{index + 1}</span>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${item.isUser ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {item.name}
                    </span>
                    {item.isUser && (
                      <span className="text-[9px] font-mono bg-cyan-900/80 text-cyan-200 px-1.5 py-0.2 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.mission}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-amber-400">
                  {item.score.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Modal */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            Kembali ke Flight Deck
          </button>
        </div>

      </div>
    </div>
  );
}