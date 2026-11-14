import { describe, it, expect } from 'vitest';
import { calculateMassBudget } from '../src/engine/mass.js';
import { calculatePropulsion, STANDARD_GRAVITY } from '../src/engine/propulsion.js';
import { calculatePowerBudget } from '../src/engine/power.js';
import { calculateCommunicationBudget } from '../src/engine/communication.js';
import { calculateBudget } from '../src/engine/budget.js';
import { validateMission } from '../src/engine/validation.js';

describe('OrbitCraft Simulation Physics Engine', () => {

  describe('1. Mass Budget Module', () => {
    it('accurately computes dry mass, propellant, and launch capacity margin', () => {
      const components = [
        { category: 'bus', massKg: 50 },
        { category: 'payload', massKg: 20 },
        { category: 'propulsion', massKg: 15, propellantMassKg: 35 }
      ];
      const mission = { payloadCapacityKg: 200 };

      const result = calculateMassBudget(components, mission);
      expect(result.dryMassKg).toBe(85);
      expect(result.propellantMassKg).toBe(35);
      expect(result.totalMassKg).toBe(120);
      expect(result.remainingMarginKg).toBe(80);
      expect(result.isOverweight).toBe(false);
      expect(result.utilizationPercentage).toBe(60);
    });

    it('flags overweight spacecraft configurations', () => {
      const components = [{ category: 'bus', massKg: 300 }];
      const mission = { payloadCapacityKg: 250 };

      const result = calculateMassBudget(components, mission);
      expect(result.isOverweight).toBe(true);
      expect(result.remainingMarginKg).toBe(-50);
    });
  });

  describe('2. Tsiolkovsky Rocket Equation & Propulsion', () => {
    it('computes exact Delta-v according to standard rocket formula', () => {
      const dryMass = 100;
      const propMass = 100;
      const isp = 300;
      const propulsionMod = [{ ispSeconds: isp, propellantMassKg: propMass, thrustN: 100 }];

      const result = calculatePropulsion(dryMass, propMass, propulsionMod, 1500);
      const expectedDeltaV = isp * STANDARD_GRAVITY * Math.log(2);

      expect(result.availableDeltaV).toBeCloseTo(expectedDeltaV, 1);
      expect(result.hasPropulsion).toBe(true);
      expect(result.isSufficient).toBe(expectedDeltaV >= 1500);
    });

    it('returns zero Delta-v safely when no propellant is present', () => {
      const result = calculatePropulsion(150, 0, [], 500);
      expect(result.availableDeltaV).toBe(0);
      expect(result.isSufficient).toBe(false);
      expect(result.hasPropulsion).toBe(false);
    });
  });

  describe('3. Power & Orbital Eclipse Simulation', () => {
    it('scales solar generation with solarFluxMultiplier and accounts for eclipse energy', () => {
      const components = [
        { category: 'power', subCategory: 'generator', solarDependent: true, powerGenerationW: 200 },
        { category: 'power', subCategory: 'battery', batteryCapacityWh: 100 },
        { category: 'subsystem', powerConsumptionW: 50 }
      ];
      const missionConfig = {
        solarFluxMultiplier: 0.43,
        eclipseDurationHours: 1.0,
        minPowerMarginW: 10,
        requireBatteryForEclipse: true
      };

      const result = calculatePowerBudget(components, missionConfig);
      expect(result.effectiveSolarGenerationW).toBe(86);
      expect(result.daylightNetMarginW).toBe(36);
      expect(result.hasDaylightSurplus).toBe(true);
      expect(result.batteryEnergyRequiredWh).toBe(50);
      expect(result.remainingBatteryWh).toBe(50);
      expect(result.survivesEclipse).toBe(true);
    });

    it('fails eclipse survival if battery storage is insufficient', () => {
      const components = [
        { category: 'power', subCategory: 'generator', solarDependent: true, powerGenerationW: 300 },
        { category: 'power', subCategory: 'battery', batteryCapacityWh: 20 },
        { category: 'subsystem', powerConsumptionW: 50 }
      ];
      const missionConfig = {
        solarFluxMultiplier: 1.0,
        eclipseDurationHours: 1.0,
        requireBatteryForEclipse: true
      };

      const result = calculatePowerBudget(components, missionConfig);
      expect(result.survivesEclipse).toBe(false);
      expect(result.isPowerPositive).toBe(false);
    });
  });

  describe('4. Communication & Storage Buffer', () => {
    it('detects unbuffered storage overflow when downlink cannot keep up', () => {
      const components = [
        { category: 'payload', dataRateMbps: 50 },
        { category: 'communication', maxDataRateMbps: 10 },
        { storageGB: 5 }
      ];
      const commConfig = {
        observationWindowHours: 2.0,
        commWindowHours: 1.0,
        minDownlinkRateMbps: 5,
        distanceEfficiencyFactor: 1.0
      };

      const result = calculateCommunicationBudget(components, commConfig);
      expect(result.hasStorageOverflow).toBe(true);
      expect(result.isDataBalanced).toBe(false);
    });
  });

  describe('5. Mission Budget Procurement', () => {
    it('calculates total acquisition cost and remaining funds', () => {
      const components = [
        { category: 'bus', cost: 100000 },
        { category: 'payload', cost: 50000 }
      ];
      const result = calculateBudget(components, 200000);
      expect(result.totalCost).toBe(150000);
      expect(result.remainingFunds).toBe(50000);
      expect(result.isWithinBudget).toBe(true);
    });
  });

  describe('6. Master Mission Validation & Scoring', () => {
    it('validates a balanced spacecraft as FLIGHT_READY', () => {
      const validComponents = [
        { id: 'bus_basic', category: 'bus', massKg: 45, maxModules: 10, storageGB: 10, cost: 100000 },
        { id: 'payload_cam', category: 'payload', massKg: 10, powerConsumptionW: 20, dataRateMbps: 5, scientificValue: 50, cost: 50000 },
        { id: 'power_solar', category: 'power', subCategory: 'generator', massKg: 15, powerGenerationW: 150, solarDependent: true, cost: 40000 },
        { id: 'power_bat', category: 'power', subCategory: 'battery', massKg: 10, batteryCapacityWh: 100, cost: 30000 },
        { id: 'prop_mono', category: 'propulsion', massKg: 15, propellantMassKg: 50, ispSeconds: 250, thrustN: 20, cost: 50000 },
        { id: 'comm_ant', category: 'communication', massKg: 5, powerConsumptionW: 10, maxDataRateMbps: 20, cost: 30000 },
        { id: 'sub_obc', category: 'subsystem', subRole: 'avionics', massKg: 5, powerConsumptionW: 15, cost: 40000 }
      ];

      const mission = {
        payloadCapacityKg: 300,
        requiredDeltaV: 400,
        maximumBudget: 500000,
        requiredScientificValue: 40,
        powerRequirements: { sunlightDurationHours: 1.0, eclipseDurationHours: 0.5, solarFluxMultiplier: 1.0, minPowerMarginW: 10 },
        communicationRequirements: { observationWindowHours: 1.0, commWindowHours: 1.0, minDownlinkRateMbps: 10, distanceEfficiencyFactor: 1.0 },
        specialConstraints: {
          requiredCategories: ['bus', 'payload', 'power', 'propulsion', 'communication'],
          requiredSubRoles: ['avionics']
        }
      };

      const report = validateMission(validComponents, mission);
      expect(report.isValid).toBe(true);
      expect(report.overallStatus).toBe('FLIGHT_READY');
      expect(report.scientificScore).toBe(50);
      expect(report.failures.length).toBe(0);
    });
  });

});