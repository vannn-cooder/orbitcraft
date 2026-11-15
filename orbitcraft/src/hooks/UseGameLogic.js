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
  const [missions] = useState(missionsData || []);
  const [components] = useState(componentsData || []);
  const [activeMissionId, setActiveMissionId] = useState(missionsData?.[0]?.id || null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [unlockedMissionIds, setUnlockedMissionIds] = useState(['mission_1_leo']);
  const [completedMissionIds, setCompletedMissionIds] = useState([]);

  // 1. Muat progress yang tersimpan di browser saat pertama kali dibuka
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedMissionIds && Array.isArray(parsed.unlockedMissionIds)) {
          setUnlockedMissionIds(parsed.unlockedMissionIds);
        }
        if (parsed.completedMissionIds && Array.isArray(parsed.completedMissionIds)) {
          setCompletedMissionIds(parsed.completedMissionIds);
        }
      }
    } catch (e) {
      console.warn('Gagal membaca saved state dari localStorage:', e);
    }
  }, []);

  // 2. Simpan progress misi secara otomatis jika ada misi baru yang selesai
  useEffect(() => {
    try {
      const payload = JSON.stringify({
        unlockedMissionIds,
        completedMissionIds
      });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (e) {
      console.warn('Gagal menyimpan state ke localStorage:', e);
    }
  }, [unlockedMissionIds, completedMissionIds]);

  // Data detail misi aktif
  const activeMission = useMemo(() => {
    return missions.find((m) => m.id === activeMissionId) || missions[0] || null;
  }, [missions, activeMissionId]);

  // Kalkulasi fisika roket (Delta-V, Massa, Daya, Validasi)
  const validationResult = useMemo(() => {
    return validateMission(selectedComponents, activeMission);
  }, [selectedComponents, activeMission]);

  // Ganti misi terpilih
  const selectMission = (missionId) => {
    if (unlockedMissionIds.includes(missionId)) {
      setActiveMissionId(missionId);
    }
  };

  // Tambah modul ke slot wahana
  const addComponent = (componentInput) => {
    // 1. Ambil objek modul baik jika input berupa objek utuh maupun ID string
    let compToAdd = null;
    if (typeof componentInput === 'object' && componentInput !== null) {
      compToAdd = componentInput;
    } else {
      compToAdd = components.find(
        (c) => String(c.id).toLowerCase() === String(componentInput).toLowerCase()
      );
    }

    if (!compToAdd) {
      console.warn('[UseGameLogic] Modul tidak ditemukan di katalog:', componentInput);
      return;
    }

    // 2. Baca batas slot misi (Prioritaskan properti misi, default ke 8 jika tidak ada)
    const rawLimit = 
      activeMission?.maxSlots ??
      activeMission?.slotLimit ??
      activeMission?.slots ??
      activeMission?.max_slots ??
      activeMission?.maxComponents ??
      8;

    const maxSlots = Number(rawLimit) > 0 ? Number(rawLimit) : 8;

    // 3. Masukkan ke slot
    setSelectedComponents((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      if (currentList.length >= maxSlots) {
        console.warn(`[UseGameLogic] Slot penuh! (${currentList.length}/${maxSlots})`);
        return currentList;
      }

      const itemWithInstance = {
        ...compToAdd,
        instanceId: `${compToAdd.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      };

      const updated = [...currentList, itemWithInstance];
      console.log(`[UseGameLogic] Modul masuk: ${compToAdd.name || compToAdd.id} (${updated.length}/${maxSlots})`);
      return updated;
    });
  };

  // Hapus modul tertentu berdasarkan index urutan slot
  const removeComponentAtIndex = (indexToRemove) => {
    setSelectedComponents((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Bersihkan seluruh slot wahana
  const clearAssembly = () => {
    setSelectedComponents([]);
  };

  // Catat keberhasilan misi dan buka kunci level selanjutnya
  const recordMissionSuccess = (missionId) => {
    setCompletedMissionIds((prev) => {
      if (!prev.includes(missionId)) {
        return [...prev, missionId];
      }
      return prev;
    });

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

  // Reset semua progres permainan
  const resetAllProgress = () => {
    setUnlockedMissionIds(['mission_1_leo']);
    setCompletedMissionIds([]);
    setSelectedComponents([]);
    setActiveMissionId('mission_1_leo');
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    missions,
    components,
    activeMission,
    selectedComponents,
    setSelectedComponents,
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

export default useGameLogic;