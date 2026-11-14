/**
 * OrbitCraft - Main Game Logic Hook
 * Central state coordinator for mission progression, spacecraft assembly, and real-time telemetry.
 */

import { useState, useMemo, useEffect } from 'react';
import missionsData from '../data/missions.json';
import componentsData from '../data/components.json';
import { validateMission } from '../engine/validation.js';

const STORAGE_KEY = 'orbitcraft_game_state_v1';

export function useGameLogic() {
  const [missions] = useState(missionsData);
  const [components] = useState(componentsData);
  const [activeMissionId, setActiveMissionId] = useState(missionsData[0]?.id || null);
  const [selectedComponentIds, setSelectedComponentIds] = useState([]);
  const [unlockedMissionIds, setUnlockedMissionIds] = useState(['mission_1_leo']);
  const [completedMissionIds, setCompletedMissionIds] = useState([]);

  // Load saved progression on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedMissionIds) setUnlockedMissionIds(parsed.unlockedMissionIds);
        if (parsed.completedMissionIds) setCompletedMissionIds(parsed.completedMissionIds);
      }
    } catch (e) {
      console.warn('Could not read saved game state from localStorage:', e);
    }
  }, []);

  // Persist progression whenever unlocked/completed lists change
  useEffect(() => {
    try {
      const payload = JSON.stringify({
        unlockedMissionIds,
        completedMissionIds
      });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (e) {
      console.warn('Could not save game state to localStorage:', e);
    }
  }, [unlockedMissionIds, completedMissionIds]);

  // Current active mission object
  const activeMission = useMemo(() => {
    return missions.find((m) => m.id === activeMissionId) || missions[0] || null;
  }, [missions, activeMissionId]);

  // Array of actual component objects currently on the spacecraft
  const selectedComponents = useMemo(() => {
    return selectedComponentIds
      .map((id) => components.find((c) => c.id === id))
      .filter(Boolean);
  }, [selectedComponentIds, components]);

  // Real-time engineering validation from engine
  const validationResult = useMemo(() => {
    return validateMission(selectedComponents, activeMission);
  }, [selectedComponents, activeMission]);

  // Actions
  const selectMission = (missionId) => {
    if (unlockedMissionIds.includes(missionId)) {
      setActiveMissionId(missionId);
    }
  };

  const addComponent = (componentId) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    // Bus category rule: only 1 bus permitted. Replace existing bus if selected.
    if (component.category === 'bus') {
      setSelectedComponentIds((prev) => {
        const nonBusIds = prev.filter((id) => {
          const comp = components.find((c) => c.id === id);
          return comp && comp.category !== 'bus';
        });
        return [componentId, ...nonBusIds];
      });
      return;
    }

    setSelectedComponentIds((prev) => [...prev, componentId]);
  };

  const removeComponentAtIndex = (indexToRemove) => {
    setSelectedComponentIds((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAssembly = () => {
    setSelectedComponentIds([]);
  };

  const recordMissionSuccess = (missionId) => {
    setCompletedMissionIds((prev) => {
      if (!prev.includes(missionId)) {
        return [...prev, missionId];
      }
      return prev;
    });

    // Unlock next mission in sequence
    const currentIndex = missions.findIndex((m) => m.id === missionId);
    if (currentIndex >= 0 && currentIndex + 1 < missions.length) {
      const nextMission = missions[currentIndex + 1];
      setUnlockedMissionIds((prev) => {
        if (!prev.includes(nextMission.id)) {
          return [...prev, nextMission.id];
        }
        return prev;
      });
    }
  };

  const resetAllProgress = () => {
    setUnlockedMissionIds(['mission_1_leo']);
    setCompletedMissionIds([]);
    setSelectedComponentIds([]);
    setActiveMissionId('mission_1_leo');
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    missions,
    components,
    activeMission,
    selectedComponents,
    selectedComponentIds,
    unlockedMissionIds,
    completedMissionIds,
    validationResult,
    selectMission,
    addComponent,
    removeComponentAtIndex,
    clearAssembly,
    recordMissionSuccess,
    resetAllProgress
  };
}