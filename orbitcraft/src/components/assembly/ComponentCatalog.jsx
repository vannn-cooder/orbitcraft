import React, { useState } from 'react';
import { 
  Box, 
  Cpu, 
  Zap, 
  Flame, 
  Radio, 
  Wrench, 
  Plus, 
  Info,
  DollarSign,
  Weight,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Modules', icon: Layers },
  { id: 'bus', label: 'Bus', icon: Box },
  { id: 'payload', label: 'Payload', icon: Cpu },
  { id: 'power', label: 'Power', icon: Zap },
  { id: 'propulsion', label: 'Propulsion', icon: Flame },
  { id: 'communication', label: 'Comm', icon: Radio },
  { id: 'subsystem', label: 'Subsystems', icon: Wrench },
];

export default function ComponentCatalog({ components = [], onAddComponent }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredComponents = activeTab === 'all'
    ? components
    : components.filter((c) => c.category === activeTab);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Layers className="w-5 h-5" />
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
            Component Catalog
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {filteredComponents.length} Available
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4 pb-2 border-b border-slate-800/60">
        {CATEGORIES.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Component Cards List */}
      <div className="space-y-3 overflow-y-auto max-h-[650px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredComponents.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {item.category} {item.subRole ? `• ${item.subRole}` : ''}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">
                    {item.name}
                  </h3>
                </div>
                <button
                  onClick={() => onAddComponent(item.id)}
                  className="flex items-center space-x-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-2.5 py-1.5 rounded-md shadow-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Install</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center space-x-1">
                <Weight className="w-3.5 h-3.5 text-sky-400" />
                <span>{item.massKg} kg</span>
                {item.propellantMassKg ? <span className="text-[10px] text-sky-500">(+{item.propellantMassKg}p)</span> : null}
              </div>

              <div className="flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                <span>${(item.cost / 1000).toFixed(0)}k</span>
              </div>

              {item.powerGenerationW > 0 ? (
                <div className="flex items-center space-x-1 text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{item.powerGenerationW}W</span>
                </div>
              ) : item.powerConsumptionW > 0 ? (
                <div className="flex items-center space-x-1 text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>-{item.powerConsumptionW}W</span>
                </div>
              ) : item.batteryCapacityWh > 0 ? (
                <div className="flex items-center space-x-1 text-amber-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{item.batteryCapacityWh}Wh</span>
                </div>
              ) : null}

              {item.ispSeconds ? (
                <div className="flex items-center space-x-1 text-indigo-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{item.ispSeconds}s Isp</span>
                </div>
              ) : item.dataRateMbps ? (
                <div className="flex items-center space-x-1 text-purple-400">
                  <Radio className="w-3.5 h-3.5" />
                  <span>{item.dataRateMbps}Mbps</span>
                </div>
              ) : item.maxDataRateMbps ? (
                <div className="flex items-center space-x-1 text-indigo-400">
                  <Radio className="w-3.5 h-3.5" />
                  <span>DL:{item.maxDataRateMbps}M</span>
                </div>
              ) : item.storageGB ? (
                <div className="flex items-center space-x-1 text-cyan-400">
                  <Box className="w-3.5 h-3.5" />
                  <span>{item.storageGB}GB</span>
                </div>
              ) : null}
            </div>

            {/* Limitations Notice */}
            {item.limitations && (
              <div className="mt-2 text-[10px] font-mono text-amber-400/80 bg-amber-950/20 px-2 py-1 rounded border border-amber-900/30 flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                <span className="truncate">{item.limitations}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}