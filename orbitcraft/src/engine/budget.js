/**
 * OrbitCraft - Financial Procurement & Mission Budget Engine
 * Units: Fictional Game Currency ($ USD)
 */

/**
 * Calculates total procurement cost, available budget, and financial feasibility.
 * 
 * @param {Array<Object>} selectedComponents - Selected spacecraft components
 * @param {number} maximumBudget - Mission budget cap
 * @returns {Object} Budget allocation metrics
 */
export function calculateBudget(selectedComponents = [], maximumBudget = 0) {
  const maxBudget = Number(maximumBudget) || 0;
  let totalCost = 0;
  const costByCategory = {
    bus: 0,
    payload: 0,
    power: 0,
    propulsion: 0,
    communication: 0,
    subsystem: 0
  };

  selectedComponents.forEach((component) => {
    const cost = Number(component.cost) || 0;
    totalCost += cost;

    if (component.category && costByCategory[component.category] !== undefined) {
      costByCategory[component.category] += cost;
    }
  });

  const remainingFunds = maxBudget - totalCost;
  const budgetUtilizationPct = maxBudget > 0 ? (totalCost / maxBudget) * 100 : 0;
  const isWithinBudget = totalCost <= maxBudget;

  return {
    totalCost,
    maxBudget,
    remainingFunds,
    budgetUtilizationPct: Number(budgetUtilizationPct.toFixed(1)),
    isWithinBudget,
    costByCategory
  };
}