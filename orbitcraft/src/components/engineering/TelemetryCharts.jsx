import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, Activity } from 'lucide-react';

// Palette color scheme matching NASA Mission Control aesthetic
const CATEGORY_COLORS = {
  bus: '#38bdf8',         // Sky
  payload: '#c084fc',     // Purple
  propulsion: '#34d399',  // Emerald
  power: '#fbbf24',       // Amber
  communication: '#818cf8',// Indigo
  subsystem: '#94a3b8',   // Slate
  remaining: '#1e293b'    // Deep Slate (Available Margin)
};

export default function TelemetryCharts({ validationResult, activeMission }) {
  if (!validationResult || !validationResult.subsystems) return null;

  const { mass, power } = validationResult.subsystems;
  const massBreakdown = mass?.metrics?.breakdownByCategory || {};
  const remainingMass = Math.max(0, mass?.metrics?.remainingMarginKg || 0);

  // 1. Prepare Data for Mass Distribution Pie Chart
  const massChartData = [
    { name: 'Bus Structure', value: massBreakdown.bus || 0, color: CATEGORY_COLORS.bus },
    { name: 'Science Payload', value: massBreakdown.payload || 0, color: CATEGORY_COLORS.payload },
    { name: 'Propulsion & Fuel', value: massBreakdown.propulsion || 0, color: CATEGORY_COLORS.propulsion },
    { name: 'Power Subsystems', value: massBreakdown.power || 0, color: CATEGORY_COLORS.power },
    { name: 'Communication', value: massBreakdown.communication || 0, color: CATEGORY_COLORS.communication },
    { name: 'Avionics & Thermal', value: massBreakdown.subsystem || 0, color: CATEGORY_COLORS.subsystem },
    { name: 'Remaining Margin', value: remainingMass, color: CATEGORY_COLORS.remaining }
  ].filter((item) => item.value > 0);

  // 2. Prepare Data for Orbital Day/Night Power Simulation Profile
  const sunlightDuration = activeMission?.powerRequirements?.sunlightDurationHours || 1.0;
  const eclipseDuration = activeMission?.powerRequirements?.eclipseDurationHours || 0.6;
  const totalOrbitTime = sunlightDuration + eclipseDuration;

  const daylightGen = power?.metrics?.daylightGenerationW || 0;
  const rtgGen = power?.metrics?.rtgGenerationW || 0;
  const consumption = power?.metrics?.totalConsumptionW || 0;

  // Generate 8 simulated time points along 1 orbital revolution
  const powerProfileData = [
    { time: '0.0h', phase: 'Daylight', generation: daylightGen, consumption: consumption, net: daylightGen - consumption },
    { time: `${(sunlightDuration * 0.5).toFixed(1)}h`, phase: 'Daylight', generation: daylightGen, consumption: consumption, net: daylightGen - consumption },
    { time: `${sunlightDuration.toFixed(1)}h`, phase: 'Daylight End', generation: daylightGen, consumption: consumption, net: daylightGen - consumption },
    { time: `${(sunlightDuration + 0.05).toFixed(1)}h`, phase: 'Eclipse Entry', generation: rtgGen, consumption: consumption, net: rtgGen - consumption },
    { time: `${(sunlightDuration + eclipseDuration * 0.5).toFixed(1)}h`, phase: 'Deep Eclipse', generation: rtgGen, consumption: consumption, net: rtgGen - consumption },
    { time: `${(totalOrbitTime - 0.05).toFixed(1)}h`, phase: 'Eclipse Exit', generation: rtgGen, consumption: consumption, net: rtgGen - consumption },
    { time: `${totalOrbitTime.toFixed(1)}h`, phase: 'Daylight Return', generation: daylightGen, consumption: consumption, net: daylightGen - consumption }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Activity className="w-5 h-5" />
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-white">
            Engineering Visual Diagnostics
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Recharts Mission Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Mass Allocation Donut Chart */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
              <PieIcon className="w-4 h-4" /> Mass Distribution Profile
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total: <strong className="text-white">{mass?.metrics?.totalMassKg} kg</strong> / {mass?.metrics?.maxCapacityKg} kg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={massChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {massChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val.toFixed(1)} kg`, name]}
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    paddingTop: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] font-mono text-slate-500 text-center mt-2">
            Donut perbandingan massa subsistem terhadap kapasitas roket peluncur.
          </p>
        </div>

        {/* Chart 2: Orbital Power & Eclipse Profile Area Chart */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Orbital Day / Eclipse Power Profile
            </span>
            <span className="text-xs font-mono text-slate-400">
              Battery: <strong className={power?.metrics?.survivesEclipse ? 'text-emerald-400' : 'text-rose-400'}>
                {power?.metrics?.totalBatteryCapacityWh} Wh
              </strong>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerProfileData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  formatter={(val, name) => [`${val.toFixed(1)} W`, name === 'generation' ? 'Power Generated' : 'Power Consumed']}
                  labelFormatter={(lbl) => `Time: ${lbl}`}
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    paddingTop: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="generation"
                  name="Generation (W)"
                  stroke="#38bdf8"
                  fillOpacity={1}
                  fill="url(#colorGeneration)"
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  name="Consumption (W)"
                  stroke="#f43f5e"
                  fillOpacity={1}
                  fill="url(#colorConsumption)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] font-mono text-slate-500 text-center mt-2">
            Kurva suplai daya listrik saat siang vs saat masuk fase gerhana (*eclipse*).
          </p>
        </div>

      </div>
    </div>
  );
}