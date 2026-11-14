/**
 * OrbitCraft - Communication & Telemetry Data Engine
 * Units: Data Rates in Mbps, Storage in GB, Time in Hours
 * 1 Byte = 8 bits, 1 GB = 1000 MB (SI Decimal convention for spacecraft storage)
 */

/**
 * Calculates scientific data generated vs downlink capability during orbital passes.
 * 
 * @param {Array<Object>} selectedComponents - Installed components
 * @param {Object} commConfig - Mission communication configuration
 * @returns {Object} Data transmission budget and storage capacity validation
 */
export function calculateCommunicationBudget(selectedComponents = [], commConfig = {}) {
  const {
    observationWindowHours = 2.0,
    commWindowHours = 0.8,
    minDownlinkRateMbps = 8,
    distanceEfficiencyFactor = 1.0
  } = commConfig;

  let totalDataRateMbps = 0;
  let maxAntennaDownlinkRateMbps = 0;
  let totalStorageGB = 0;

  selectedComponents.forEach((component) => {
    // Payloads generate data
    if (component.category === 'payload' && component.dataRateMbps) {
      totalDataRateMbps += Number(component.dataRateMbps) || 0;
    }

    // Antennas provide downlink bandwidth
    if (component.category === 'communication' && component.maxDataRateMbps) {
      if (Number(component.maxDataRateMbps) > maxAntennaDownlinkRateMbps) {
        maxAntennaDownlinkRateMbps = Number(component.maxDataRateMbps);
      }
    }

    // Storage capacity from bus, OBC, or dedicated storage units
    if (component.storageGB) {
      totalStorageGB += Number(component.storageGB) || 0;
    }
  });

  // Effective downlink rate reduced by interplanetary distance
  const effectiveDownlinkRateMbps = maxAntennaDownlinkRateMbps * distanceEfficiencyFactor;

  // Total scientific data volume generated during science observation phase (Megabits)
  const generatedMbits = totalDataRateMbps * (observationWindowHours * 3600);
  const generatedDataGB = generatedMbits / (8 * 1000);

  // Total data volume capable of being downlinked during ground contact pass (Megabits)
  const downlinkMbits = effectiveDownlinkRateMbps * (commWindowHours * 3600);
  const downlinkedDataGB = downlinkMbits / (8 * 1000);

  // Data backlog that must stay in onboard storage buffer
  const unbufferedDataGB = Math.max(0, generatedDataGB - downlinkedDataGB);
  const remainingStorageGB = totalStorageGB - unbufferedDataGB;
  const storageUtilizationPct = totalStorageGB > 0 ? (unbufferedDataGB / totalStorageGB) * 100 : 0;

  const hasSufficientDownlink = effectiveDownlinkRateMbps >= minDownlinkRateMbps;
  const hasStorageOverflow = unbufferedDataGB > totalStorageGB;
  const isDataBalanced = hasSufficientDownlink && !hasStorageOverflow;

  return {
    totalDataRateMbps: Number(totalDataRateMbps.toFixed(2)),
    maxAntennaDownlinkRateMbps: Number(maxAntennaDownlinkRateMbps.toFixed(2)),
    effectiveDownlinkRateMbps: Number(effectiveDownlinkRateMbps.toFixed(2)),
    generatedDataGB: Number(generatedDataGB.toFixed(2)),
    downlinkedDataGB: Number(downlinkedDataGB.toFixed(2)),
    unbufferedDataGB: Number(unbufferedDataGB.toFixed(2)),
    totalStorageGB: Number(totalStorageGB.toFixed(1)),
    remainingStorageGB: Number(remainingStorageGB.toFixed(1)),
    storageUtilizationPct: Number(storageUtilizationPct.toFixed(1)),
    hasSufficientDownlink,
    hasStorageOverflow,
    isDataBalanced
  };
}