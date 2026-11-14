/**
 * OrbitCraft - Power Budget & Orbital Eclipse Engine
 * Units: Power in Watts (W), Energy in Watt-hours (Wh), Time in Hours (h)
 */

/**
 * Calculates complete power generation, consumption, and eclipse energy storage status.
 * 
 * @param {Array<Object>} selectedComponents - Installed components
 * @param {Object} missionPowerConfig - Mission orbital illumination parameters
 * @returns {Object} Power budget metrics and eclipse survivability
 */
export function calculatePowerBudget(selectedComponents = [], missionPowerConfig = {}) {
  const {
    sunlightDurationHours = 1.0,
    eclipseDurationHours = 0.6,
    solarFluxMultiplier = 1.0,
    minPowerMarginW = 10,
    requireBatteryForEclipse = true
  } = missionPowerConfig;

  let nominalSolarGenerationW = 0;
  let rtgGenerationW = 0;
  let totalConsumptionW = 0;
  let totalBatteryCapacityWh = 0;

  selectedComponents.forEach((component) => {
    // Accumulate power consumption
    totalConsumptionW += Number(component.powerConsumptionW) || 0;

    // Accumulate power sources
    if (component.category === 'power') {
      if (component.subCategory === 'battery') {
        totalBatteryCapacityWh += Number(component.batteryCapacityWh) || 0;
      } else if (component.solarDependent) {
        nominalSolarGenerationW += Number(component.powerGenerationW) || 0;
      } else {
        // RTG or non-solar nuclear source
        rtgGenerationW += Number(component.powerGenerationW) || 0;
      }
    }
  });

  // Solar generation scaled by orbital solar distance factor (Inverse-Square Law)
  const effectiveSolarGenerationW = nominalSolarGenerationW * solarFluxMultiplier;

  // Daylight Phase Metrics
  const daylightGenerationW = effectiveSolarGenerationW + rtgGenerationW;
  const daylightNetMarginW = daylightGenerationW - totalConsumptionW;
  const hasDaylightSurplus = daylightNetMarginW >= minPowerMarginW;

  // Eclipse Phase Metrics (Solar drops to 0; only RTG supplies continuous power)
  const eclipseGenerationW = rtgGenerationW;
  const eclipsePowerDeficitW = Math.max(0, totalConsumptionW - eclipseGenerationW);
  
  // Energy required from batteries during the dark eclipse phase (Wh = W * hours)
  const batteryEnergyRequiredWh = eclipsePowerDeficitW * eclipseDurationHours;
  const remainingBatteryWh = totalBatteryCapacityWh - batteryEnergyRequiredWh;
  const batteryUtilizationPct = totalBatteryCapacityWh > 0
    ? (batteryEnergyRequiredWh / totalBatteryCapacityWh) * 100
    : (batteryEnergyRequiredWh > 0 ? 100 : 0);

  // Eclipse survivability check
  const survivesEclipse = !requireBatteryForEclipse || (
    eclipsePowerDeficitW === 0 || remainingBatteryWh >= 0
  );

  const isPowerPositive = hasDaylightSurplus && survivesEclipse;

  return {
    totalConsumptionW: Number(totalConsumptionW.toFixed(1)),
    daylightGenerationW: Number(daylightGenerationW.toFixed(1)),
    effectiveSolarGenerationW: Number(effectiveSolarGenerationW.toFixed(1)),
    rtgGenerationW: Number(rtgGenerationW.toFixed(1)),
    daylightNetMarginW: Number(daylightNetMarginW.toFixed(1)),
    totalBatteryCapacityWh: Number(totalBatteryCapacityWh.toFixed(1)),
    batteryEnergyRequiredWh: Number(batteryEnergyRequiredWh.toFixed(1)),
    remainingBatteryWh: Number(remainingBatteryWh.toFixed(1)),
    batteryUtilizationPct: Number(batteryUtilizationPct.toFixed(1)),
    hasDaylightSurplus,
    survivesEclipse,
    isPowerPositive
  };
}