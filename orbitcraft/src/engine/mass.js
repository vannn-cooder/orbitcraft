/**
 * OrbitCraft - Spacecraft Mass Budget Engine
 * Standard SI Units: Kilograms (kg)
 */

/**
 * Calculates the complete mass distribution of the spacecraft.
 * 
 * @param {Array<Object>} selectedComponents - Array of components installed on the spacecraft
 * @param {Object} mission - Mission definition containing launcher payload capacity
 * @returns {Object} Mass budget breakdown and structural margins
 */
export function calculateMassBudget(selectedComponents = [], mission = null) {
  let dryMassKg = 0;
  let propellantMassKg = 0;
  const breakdownByCategory = {
    bus: 0,
    payload: 0,
    power: 0,
    propulsion: 0,
    communication: 0,
    subsystem: 0
  };

  selectedComponents.forEach((component) => {
    const mass = Number(component.massKg) || 0;
    dryMassKg += mass;

    if (component.category && breakdownByCategory[component.category] !== undefined) {
      breakdownByCategory[component.category] += mass;
    }

    if (component.propellantMassKg) {
      const propMass = Number(component.propellantMassKg) || 0;
      propellantMassKg += propMass;
      breakdownByCategory.propulsion += propMass;
    }
  });

  const totalMassKg = dryMassKg + propellantMassKg;
  const maxCapacityKg = mission && Number(mission.payloadCapacityKg) ? Number(mission.payloadCapacityKg) : 0;
  const remainingMarginKg = maxCapacityKg - totalMassKg;
  const utilizationPercentage = maxCapacityKg > 0 ? (totalMassKg / maxCapacityKg) * 100 : 0;
  const isOverweight = maxCapacityKg > 0 ? totalMassKg > maxCapacityKg : false;

  return {
    dryMassKg: Number(dryMassKg.toFixed(2)),
    propellantMassKg: Number(propellantMassKg.toFixed(2)),
    totalMassKg: Number(totalMassKg.toFixed(2)),
    maxCapacityKg: Number(maxCapacityKg.toFixed(2)),
    remainingMarginKg: Number(remainingMarginKg.toFixed(2)),
    utilizationPercentage: Number(utilizationPercentage.toFixed(1)),
    isOverweight,
    breakdownByCategory
  };
}