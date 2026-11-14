/**
 * OrbitCraft - Central Mission Validation & Scoring Engine
 * Evaluates compliance across all 5 engineering constraints and mission contracts.
 */

import { calculateMassBudget } from './mass.js';
import { calculatePropulsion } from './propulsion.js';
import { calculatePowerBudget } from './power.js';
import { calculateCommunicationBudget } from './communication.js';
import { calculateBudget } from './budget.js';

/**
 * Conducts a full aerospace systems engineering review of the spacecraft configuration.
 * 
 * @param {Array<Object>} selectedComponents - Currently installed spacecraft modules
 * @param {Object} mission - Selected mission specification
 * @returns {Object} Comprehensive engineering telemetry, subsystem status, warnings, and scoring
 */
export function validateMission(selectedComponents = [], mission = null) {
  if (!mission) {
    return {
      isValid: false,
      overallStatus: 'NO_MISSION_SELECTED',
      score: 0,
      failures: ['Tidak ada misi yang dipilih untuk divalidasi.'],
      warnings: [],
      subsystems: {}
    };
  }

  const failures = [];
  const warnings = [];

  // 1. Structural Bus & Slot Audit
  const busComponents = selectedComponents.filter((c) => c.category === 'bus');
  if (busComponents.length === 0) {
    failures.push('Struktur wahana belum memiliki modul dasar (Spacecraft Bus).');
  } else if (busComponents.length > 1) {
    failures.push('Wahana hanya boleh memiliki satu Spacecraft Bus utama.');
  }

  const activeBus = busComponents[0] || null;
  if (activeBus && activeBus.maxModules && selectedComponents.length > activeBus.maxModules) {
    failures.push(
      `Jumlah modul (${selectedComponents.length}) melebihi batas struktural bus (${activeBus.maxModules} slot).`
    );
  }

  // 2. Check Required Categories & Mandatory Payloads
  const specialConstraints = mission.specialConstraints || {};
  const requiredCategories = specialConstraints.requiredCategories || [];
  const installedCategories = new Set(selectedComponents.map((c) => c.category));

  requiredCategories.forEach((cat) => {
    if (!installedCategories.has(cat)) {
      failures.push(`Wahana belum memiliki subsistem dari kategori wajib: [${cat.toUpperCase()}].`);
    }
  });

  // Check required sub-roles (e.g. avionics, thermal, attitude, navigation)
  const requiredSubRoles = specialConstraints.requiredSubRoles || [];
  const installedSubRoles = new Set(
    selectedComponents.filter((c) => c.subRole).map((c) => c.subRole)
  );

  requiredSubRoles.forEach((role) => {
    if (!installedSubRoles.has(role)) {
      failures.push(`Subsistem wajib berjenis [${role.toUpperCase()}] belum terpasang.`);
    }
  });

  // Check mandatory payload IDs
  const mandatoryPayloadIds = specialConstraints.mandatoryPayloadIds || [];
  const installedComponentIds = new Set(selectedComponents.map((c) => c.id));

  mandatoryPayloadIds.forEach((reqId) => {
    if (!installedComponentIds.has(reqId)) {
      failures.push(`Instrumen ilmiah wajib dengan ID "${reqId}" belum dipasang pada wahana.`);
    }
  });

  // Check specific required bus ID (e.g. Deep Space Bus)
  if (specialConstraints.requiredBusId && activeBus?.id !== specialConstraints.requiredBusId) {
    failures.push(
      `Misi ini mensyaratkan bus khusus bertipe "${specialConstraints.requiredBusId}" untuk bertahan dari lingkungan ekstrem.`
    );
  }

  // 3. Centralized Subsystem Budget Calculations
  const massBudget = calculateMassBudget(selectedComponents, mission);
  const propulsionComponents = selectedComponents.filter((c) => c.category === 'propulsion');
  const propulsionBudget = calculatePropulsion(
    massBudget.dryMassKg,
    massBudget.propellantMassKg,
    propulsionComponents,
    mission.requiredDeltaV
  );
  const powerBudget = calculatePowerBudget(selectedComponents, mission.powerRequirements || {});
  const commBudget = calculateCommunicationBudget(
    selectedComponents,
    mission.communicationRequirements || {}
  );
  const financialBudget = calculateBudget(selectedComponents, mission.maximumBudget);

  // 4. Constraint 1: Mass Budget Validation
  if (massBudget.isOverweight) {
    failures.push(
      `Massa total wahana (${massBudget.totalMassKg} kg) melebihi kapasitas angkut roket peluncur (${massBudget.maxCapacityKg} kg).`
    );
  } else if (massBudget.remainingMarginKg < 10 && massBudget.remainingMarginKg >= 0) {
    warnings.push(`Margin massa sangat tipis (${massBudget.remainingMarginKg} kg tersisa).`);
  }

  // 5. Constraint 2: Delta-v Validation
  if (!propulsionBudget.isSufficient) {
    failures.push(
      `Kapasitas Delta-v wahana (${propulsionBudget.availableDeltaV} m/s) tidak mencukupi target manuver misi (${propulsionBudget.requiredDeltaV} m/s).`
    );
  }

  // 6. Constraint 3: Power & Eclipse Validation
  if (!powerBudget.hasDaylightSurplus) {
    failures.push(
      `Daya listrik siang hari defisit (${powerBudget.daylightNetMarginW} W). Konsumsi lebih besar daripada daya yang dibangkitkan.`
    );
  }
  if (!powerBudget.survivesEclipse) {
    failures.push(
      `Kapasitas baterai (${powerBudget.totalBatteryCapacityWh} Wh) tidak cukup untuk menyuplai wahana selama fase gerhana (${powerBudget.batteryEnergyRequiredWh} Wh dibutuhkan).`
    );
  }

  // 7. Constraint 4: Communication & Storage Validation
  if (!commBudget.hasSufficientDownlink) {
    failures.push(
      `Laju transmisi downlink antena (${commBudget.effectiveDownlinkRateMbps} Mbps) di bawah batas minimum misi.`
    );
  }
  if (commBudget.hasStorageOverflow) {
    failures.push(
      `Penyimpanan data onboard tidak cukup. Terjadi data overflow sebesar ${commBudget.unbufferedDataGB.toFixed(1)} GB.`
    );
  }

  // 8. Constraint 5: Financial Budget Validation
  if (!financialBudget.isWithinBudget) {
    failures.push(
      `Biaya wahana ($${financialBudget.totalCost.toLocaleString()}) melebihi anggaran maksimal misi ($${financialBudget.maxBudget.toLocaleString()}).`
    );
  }

  // 9. Scientific Scoring
  let scientificScore = 0;
  selectedComponents.forEach((c) => {
    if (c.scientificValue) {
      scientificScore += Number(c.scientificValue);
    }
  });

  const requiredScience = Number(mission.requiredScientificValue) || 0;
  if (scientificScore < requiredScience) {
    failures.push(
      `Skor instrumen sains (${scientificScore}) belum memenuhi target ilmiah kontrak misi (${requiredScience}).`
    );
  }

  const isValid = failures.length === 0;

  return {
    isValid,
    overallStatus: isValid ? 'FLIGHT_READY' : 'ENGINEERING_DEFICIT',
    scientificScore,
    targetScientificValue: requiredScience,
    failures,
    warnings,
    subsystems: {
      mass: {
        status: massBudget.isOverweight ? 'FAIL' : 'PASS',
        metrics: massBudget
      },
      propulsion: {
        status: propulsionBudget.isSufficient ? 'PASS' : 'FAIL',
        metrics: propulsionBudget
      },
      power: {
        status: powerBudget.isPowerPositive ? 'PASS' : 'FAIL',
        metrics: powerBudget
      },
      communication: {
        status: commBudget.isDataBalanced ? 'PASS' : 'FAIL',
        metrics: commBudget
      },
      budget: {
        status: financialBudget.isWithinBudget ? 'PASS' : 'FAIL',
        metrics: financialBudget
      }
    }
  };
}