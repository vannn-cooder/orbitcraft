/**
 * OrbitCraft - Propulsion & Tsiolkovsky Rocket Equation Engine
 * Physics Constant: Standard gravitational acceleration g0 = 9.80665 m/s^2
 */

export const STANDARD_GRAVITY = 9.80665; // m/s^2

/**
 * Calculates available Delta-v using the Tsiolkovsky Rocket Equation:
 * Delta-v = Isp * g0 * ln(m0 / mf)
 * 
 * @param {number} dryMassKg - Final spacecraft mass after propellant burn (mf)
 * @param {number} propellantMassKg - Consumable propellant mass
 * @param {Array<Object>} propulsionComponents - Installed propulsion modules
 * @param {number} requiredDeltaV - Target mission velocity increment (m/s)
 * @returns {Object} Propulsion performance telemetry
 */
export function calculatePropulsion(
  dryMassKg = 0,
  propellantMassKg = 0,
  propulsionComponents = [],
  requiredDeltaV = 0
) {
  const m0 = dryMassKg + propellantMassKg; // Initial wet mass
  const mf = dryMassKg;                   // Final dry mass

  // Edge cases: No spacecraft mass or no propellant
  if (m0 <= 0 || mf <= 0 || propellantMassKg <= 0 || propulsionComponents.length === 0) {
    return {
      availableDeltaV: 0,
      requiredDeltaV: Number(requiredDeltaV) || 0,
      deltaVMargin: -(Number(requiredDeltaV) || 0),
      effectiveIsp: 0,
      totalThrustN: 0,
      isSufficient: (Number(requiredDeltaV) || 0) <= 0,
      massRatio: mf > 0 ? Number((m0 / mf).toFixed(3)) : 1,
      hasPropulsion: propulsionComponents.length > 0
    };
  }

  // Calculate weighted effective Specific Impulse (Isp) across active propulsion modules
  let totalWeightedIsp = 0;
  let totalPropellantCounted = 0;
  let totalThrustN = 0;

  propulsionComponents.forEach((mod) => {
    const modIsp = Number(mod.ispSeconds) || 0;
    const modProp = Number(mod.propellantMassKg) || 0;
    const modThrust = Number(mod.thrustN) || 0;

    totalThrustN += modThrust;

    if (modProp > 0) {
      totalWeightedIsp += modIsp * modProp;
      totalPropellantCounted += modProp;
    }
  });

  const effectiveIsp = totalPropellantCounted > 0
    ? totalWeightedIsp / totalPropellantCounted
    : (propulsionComponents[0]?.ispSeconds || 0);

  // Apply Tsiolkovsky Rocket Equation
  const massRatio = m0 / mf;
  const availableDeltaV = effectiveIsp * STANDARD_GRAVITY * Math.log(massRatio);
  const reqDeltaV = Number(requiredDeltaV) || 0;
  const deltaVMargin = availableDeltaV - reqDeltaV;

  return {
    availableDeltaV: Number(availableDeltaV.toFixed(1)),
    requiredDeltaV: reqDeltaV,
    deltaVMargin: Number(deltaVMargin.toFixed(1)),
    effectiveIsp: Number(effectiveIsp.toFixed(1)),
    totalThrustN: Number(totalThrustN.toFixed(2)),
    isSufficient: deltaVMargin >= 0,
    massRatio: Number(massRatio.toFixed(3)),
    hasPropulsion: true
  };
}