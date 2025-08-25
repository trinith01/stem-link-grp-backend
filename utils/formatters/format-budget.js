/**
 * Calculates remaining amount given the limit and total spent.
 * @param {number} limitAmount - Total budget limit
 * @param {number} totalSpent - Amount already spent
 * @returns {number} Remaining amount (never less than 0)
 */
export function calculateRemainingAmount(limitAmount, totalSpent) {
  if (typeof limitAmount !== "number" || typeof totalSpent !== "number") {
    return 0;
  }
  return Math.max(limitAmount - totalSpent, 0);
}

/**
 * Calculates percentage of budget spent.
 * @param {number} limitAmount - Total budget limit
 * @param {number} totalSpent - Amount already spent
 * @returns {number} Percentage spent (0–100)
 */
export function calculateSpendingPercentage(limitAmount, totalSpent) {
  if (typeof limitAmount !== "number" || limitAmount <= 0) {
    return 0;
  }
  return Math.min((totalSpent / limitAmount) * 100, 100);
}
