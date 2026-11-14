import React from 'react';
import { Box, Trash2, Cpu, Wrench, AlertCircle } from 'lucide-react';

export default function SpacecraftSlotBay({
  selectedComponents = [],
  onRemoveComponent,
  onClearAll
}) {
  const activeBus = selectedComponents.find((c) => c.category === 'bus');
  const maxSlots = activeBus?.maxModules || 0;
  const usedSlots = selectedComponents.length;
  const isOverSlotLimit = maxSlots > 0 && usedSlots > maxSlots;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Cpu className="w-5 h-5" />
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
            Spacecraft Assembly Bay
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
            isOverSlotLimit
              ? 'bg-rose-950 text-rose-400 border-rose-800'
              : 'bg-slate-950 text-slate-300 border-slate-800'
          }`}>
            Slots: {usedSlots} / {maxSlots || '—'}
          </span>
          {usedSlots > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear Bay
            </button>
          )}
        </div>
      </div>

      {!activeBus && (
        <div className="mb-4 bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs font-mono text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Wajib memasang 1 Spacecraft Bus terlebih dahulu dari katalog sebelum modul lain berfungsi.</span>
        </div>
      )}

      {/* Installed Modules List */}
      <div className="space-y-2 overflow-y-auto max-h-[650px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {selectedComponents.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-lg p-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center space-y-2 min-h-[300px]">
            <Box className="w-8 h-8 text-slate-600" />
            <p>Assembly Bay kosong.</p>
            <p className="text-[11px] text-slate-600">Pilih modul dari katalog untuk merakit wahana antariksa.</p>
          </div>
        ) : (
          selectedComponents.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-xs font-mono font-bold text-slate-500 w-5">
                  #{index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-400 uppercase">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 mt-1">
                    <span>{item.massKg} kg</span>
                    <span>${(item.cost / 1000).toFixed(0)}k</span>
                    {item.scientificValue ? (
                      <span className="text-purple-400">+{item.scientificValue} Science</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemoveComponent(index)}
                title="Remove component"
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}