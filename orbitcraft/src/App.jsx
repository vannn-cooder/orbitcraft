import React, { useState } from 'react';
import { supabase } from './lib/supabase.js';
import { useGameLogic } from './hooks/UseGameLogic';
import Header from './components/dashboard/Header.jsx';
import MissionSelector from './components/mission/MissionSelector.jsx';
import MissionBriefing from './components/mission/MissionBriefing.jsx';
import EngineeringGauges from './components/engineering/EngineeringGauges.jsx';
import TelemetryCharts from './components/engineering/TelemetryCharts.jsx';
import ComponentCatalog from './components/assembly/ComponentCatalog.jsx';
import SpacecraftSlotBay from './components/assembly/SpacecraftSlotBay.jsx';
import SpacecraftSchematic from './components/assembly/SpacecraftSchematic.jsx';
import ValidationConsole from './components/engineering/ValidationConsole.jsx';
import MissionSimulationModal from './components/results/MissionSimulationModal.jsx';
import PostMissionDebrief from './components/results/PostMissionDebrief.jsx';
import FlightHandbookModal from './components/common/FlightHandbookModal.jsx';
import OrbitalTrajectoryCanvas from './components/engineering/OrbitalTrajectoryCanvas.jsx';
import LeaderboardModal from './components/results/LeaderboardModal.jsx';
import BootSequence from './components/common/BootSequence.jsx';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  // Callsign Pemain / Pilot
  const [callsign, setCallsign] = useState(() => {
    return localStorage.getItem('orbitcraft_callsign') || 'Cmdr. Walsen';
  });

  const handleCallsignChange = (name) => {
    setCallsign(name);
    localStorage.setItem('orbitcraft_callsign', name);
  };

  const {
    missions,
    components,
    activeMission,
    selectedComponents,
    unlockedMissionIds,
    completedMissionIds,
    validationResult,
    selectMission,
    addComponent,
    removeComponentAtIndex,
    clearAssembly,
    recordMissionSuccess,
    resetAllProgress
  } = useGameLogic();

  const handleStartLaunch = () => {
    setIsSimulating(true);
  };

  const handleSimulationComplete = () => {
    setIsSimulating(false);
    setIsDebriefOpen(true);

    if (validationResult?.isValid && activeMission?.id) {
      recordMissionSuccess(activeMission.id);

      const scoreCalc = Math.round(
        (validationResult.deltaV || 1000) * 1.5 - (validationResult.totalMass || 500) * 0.4
      );
      const finalScore = Math.max(scoreCalc, 2500);
      const finalDeltaV = Math.round(validationResult.deltaV || 0);
      const pilotName = callsign.trim() || 'Cmdr. Walsen';

      // 1. Kirim telemetri ke database Supabase
      supabase
        .from('leaderboard')
        .insert([
          {
            callsign: pilotName,
            mission: activeMission.name,
            score: finalScore,
            delta_v: finalDeltaV
          }
        ])
        .then(({ error }) => {
          if (error) console.error('Gagal simpan ke Supabase:', error);
        });

      // 2. Cadangan penyimpanan browser lokal
      try {
        const saved = JSON.parse(localStorage.getItem('orbitcraft_leaderboard') || '[]');
        const localRun = {
          id: Date.now(),
          callsign: pilotName,
          mission: activeMission.name,
          score: finalScore,
          deltaV: finalDeltaV,
          date: new Date().toISOString().split('T')[0],
          isNew: true
        };
        localStorage.setItem('orbitcraft_leaderboard', JSON.stringify([localRun, ...saved]));
      } catch (e) {
        console.error('Error saving local backup:', e);
      }
    }
  };

  const handleCloseDebrief = () => {
    setIsDebriefOpen(false);
  };

  const handleAdvanceMission = () => {
    setIsDebriefOpen(false);
    const currentIndex = missions.findIndex((m) => m.id === activeMission?.id);
    if (currentIndex >= 0 && currentIndex + 1 < missions.length) {
      const nextMission = missions[currentIndex + 1];
      selectMission(nextMission.id);
      clearAssembly();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 1. Layar Boot Sequence Awal */}
      {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}

      {/* 2. Top Header Navigasi */}
      <Header
        callsign={callsign}
        onCallsignChange={handleCallsignChange}
        validationResult={validationResult}
        activeMission={activeMission}
        completedCount={completedMissionIds.length}
        totalMissions={missions.length}
        onResetProgress={resetAllProgress}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* 3. Workbench Mission Control Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Pemilih Misi */}
        <section>
          <MissionSelector
            missions={missions}
            activeMissionId={activeMission?.id}
            unlockedMissionIds={unlockedMissionIds}
            completedMissionIds={completedMissionIds}
            onSelectMission={selectMission}
          />
        </section>

        {/* Dossier Ringkasan Misi */}
        <section>
          <MissionBriefing mission={activeMission} />
        </section>

        {/* Indikator Telemetri & Gauge Daya */}
        <section>
          <EngineeringGauges validationResult={validationResult} />
        </section>

        {/* Grafik Diagnostik Trajektori */}
        <section>
          <TelemetryCharts
            validationResult={validationResult}
            activeMission={activeMission}
          />
        </section>

        {/* Area Perakitan & Katalog Komponen */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Katalog dengan dukungan onClearAll untuk Preset NASA */}
          <ComponentCatalog
            components={components}
            onAddComponent={addComponent}
            onClearAll={clearAssembly}
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpacecraftSchematic selectedComponents={selectedComponents} />
              <OrbitalTrajectoryCanvas 
                validationResult={validationResult} 
                activeMission={activeMission} 
              />
            </div>

            <SpacecraftSlotBay
              selectedComponents={selectedComponents}
              onRemoveComponent={removeComponentAtIndex}
              onClearAll={clearAssembly}
            />
          </div>
        </section>

        {/* Konsol Validasi Peluncuran */}
        <section>
          <ValidationConsole
            validationResult={validationResult}
            onLaunch={handleStartLaunch}
          />
        </section>
      </main>

      {/* 4. Modal Simulasi Penerbangan & Anomali */}
      <MissionSimulationModal
        isOpen={isSimulating}
        mission={activeMission}
        validationResult={validationResult}
        onSimulationComplete={handleSimulationComplete}
      />

      {/* 5. Modal Evaluasi Misi & Debrief */}
      <PostMissionDebrief
        isOpen={isDebriefOpen}
        mission={activeMission}
        validationResult={validationResult}
        onContinue={handleAdvanceMission}
        onReconfigure={handleCloseDebrief}
      />

      {/* 6. Modal Handbook Edukasi */}
      <FlightHandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {/* 7. Modal Leaderboard Global Supabase */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        OrbitCraft: Modular Systems Architect — NASA Space Apps Challenge 2026 Simulation Environment
      </footer>
    </div>
  );
}