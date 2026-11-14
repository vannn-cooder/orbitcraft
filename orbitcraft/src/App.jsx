import React, { useState } from 'react';
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

export default function App() {
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

  const [isSimulating, setIsSimulating] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  const handleStartLaunch = () => {
    setIsSimulating(true);
  };

  const handleSimulationComplete = () => {
    setIsSimulating(false);
    setIsDebriefOpen(true);
    if (validationResult?.isValid && activeMission?.id) {
      recordMissionSuccess(activeMission.id);
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
      {/* Top Header */}
      <Header
        validationResult={validationResult}
        activeMission={activeMission}
        completedCount={completedMissionIds.length}
        totalMissions={missions.length}
        onResetProgress={resetAllProgress}
        onOpenHandbook={() => setIsHandbookOpen(true)}
      />

      {/* Main Mission Control Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* 1. Mission Flight Selector */}
        <section>
          <MissionSelector
            missions={missions}
            activeMissionId={activeMission?.id}
            unlockedMissionIds={unlockedMissionIds}
            completedMissionIds={completedMissionIds}
            onSelectMission={selectMission}
          />
        </section>

        {/* 2. Mission Briefing Dossier */}
        <section>
          <MissionBriefing mission={activeMission} />
        </section>

        {/* 3. Real-Time Telemetry & Engineering Gauges */}
        <section>
          <EngineeringGauges validationResult={validationResult} />
        </section>

        {/* 4. Visual Diagnostics: Recharts Graphs */}
        <section>
          <TelemetryCharts
            validationResult={validationResult}
            activeMission={activeMission}
          />
        </section>

       {/* 5. Assembly Bay, Visual Schematic & Component Catalog */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <ComponentCatalog
            components={components}
            onAddComponent={addComponent}
          />

          <div className="space-y-4">
            {/* Visual 2D CAD Schematic & Keplerian Orbit Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpacecraftSchematic selectedComponents={selectedComponents} />
              <OrbitalTrajectoryCanvas 
                validationResult={validationResult} 
                activeMission={activeMission} 
              />
            </div>

            {/* Modular Slot Bay List */}
            <SpacecraftSlotBay
              selectedComponents={selectedComponents}
              onRemoveComponent={removeComponentAtIndex}
              onClearAll={clearAssembly}
            />
          </div>
        </section>

        {/* 6. Diagnostic Validation Console */}
        <section>
          <ValidationConsole
            validationResult={validationResult}
            onLaunch={handleStartLaunch}
          />
        </section>
      </main>

      {/* 7. Flight Simulation Modal */}
      <MissionSimulationModal
        isOpen={isSimulating}
        mission={activeMission}
        validationResult={validationResult}
        onSimulationComplete={handleSimulationComplete}
      />

      {/* 8. Post-Mission Debrief & Scoring Modal */}
      <PostMissionDebrief
        isOpen={isDebriefOpen}
        mission={activeMission}
        validationResult={validationResult}
        onContinue={handleAdvanceMission}
        onReconfigure={handleCloseDebrief}
      />

      {/* 9. Educational Flight Handbook Modal */}
      <FlightHandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        OrbitCraft: Modular Systems Architect — NASA Space Apps Challenge 2026 Simulation Environment
      </footer>
    </div>
  );
}