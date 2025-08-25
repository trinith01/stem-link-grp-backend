import NotFoundError from "../domain/errors/not-found-error.js";
import Budget from "../models/Budget.js";
import { calculateRemainingAmount, calculateSpendingPercentage } from "../utils/formatters/format-budget.js";
import { formatCategory } from "../utils/formatters/format-category.js";
import { getTotalSpent } from "./transaction-service.js";

export async function getBudgetWithSpending(budgetId, userId) {
  // 1. Find the budget for this user
  const budget = await Budget.findOne({ _id: budgetId, userId }).populate("categoryId", "name type");
  if (!budget) throw new NotFoundError("Budget not found");

  // 2. Calculate total spent in this category and date range
  const total = await getTotalSpent(userId, budget.categoryId._id, budget.startDate, budget.endDate);

  // 3. Calculate remaining, percentage, and close-to-limit
  const remainingAmount = calculateRemainingAmount(budget.limitAmount, total);
  const spendingPercentage = calculateSpendingPercentage(budget.limitAmount, total);
  const isCloseToLimit = budget.limitAmount > 0 && remainingAmount / budget.limitAmount <= 0.1;

  // 4. Clean top-level budget & format category
  const { _id, __v, categoryId, ...rest } = budget.toObject({ virtuals: true });
  const category =  formatCategory(categoryId)

  // 5. Return budget with the extra data
  return { id: _id.toString(), ...rest, category, remainingAmount, spendingPercentage, isCloseToLimit };
}
