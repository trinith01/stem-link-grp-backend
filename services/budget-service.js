import NotFoundError from "../domain/errors/not-found-error.js";
import Budget from "../models/Budget.js";
import Reminder from "../models/Reminder.js";
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

// Check budget & generate reminders based on spending
export async function checkBudgetAndCreateReminders(budgetId, userId) {
  // Fetch budget data & destructure properties
  const budgetData = await getBudgetWithSpending(budgetId, userId);
  const { spendingPercentage, isCloseToLimit, category, name } = budgetData;

  const isHalfLimit = spendingPercentage >= 50 && spendingPercentage < 90;
  const hasReachedLimit = spendingPercentage >= 100;

  if (isHalfLimit) { // Budget >= 50%
    const exists = await Reminder.exists({ userId, budgetId, type: "halfLimit" });
    if (!exists) {
      await Reminder.create({
        budgetId,
        title: `Budget: ${name} at 50%`,
        description: `Your budget for ${category.name} has reached 50% of its limit.`,
        dueDate: new Date(),
        isRecurring: false,
        userId,
        type: "halfLimit",
      });
    }
  }

  if (isCloseToLimit) { // Budget >= 90%
    const exists = await Reminder.exists({ userId, budgetId, type: "closeLimit" });
    if (!exists) {
      await Reminder.create({
        budgetId,
        title: `Budget: ${name} at 90%`,
        description: `Your budget for ${category.name} has reached 90% of its limit.`,
        dueDate: new Date(),
        isRecurring: false,
        userId,
        type: "closeLimit",
      });
    }
  }

  if (hasReachedLimit) { // Budget >= 100%
    const exists = await Reminder.exists({ userId, budgetId, type: "fullLimit" });
    if (!exists) {
      await Reminder.create({
        budgetId,
        title: `Budget: ${name} reached 100%`,
        description: `Your budget for ${category.name} has been fully used.`,
        dueDate: new Date(),
        isRecurring: false,
        userId,
        type: "fullLimit",
      });
    }
  }

  return budgetData;
}
