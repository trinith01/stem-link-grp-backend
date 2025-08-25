import Budget from "../models/Budget.js";
import ValidationError from "../domain/errors/validation-error.js";
import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import { getBudgetWithSpending } from "../services/budget-service.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import { validateBudgetData } from "../utils/validation/validate-budget-data.js";

// Create a new budget
export const createBudget = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);

    const validationErrors = validateBudgetData(req.body);
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    const budgetDoc = await Budget.create({
      ...req.body,
      userId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    });

    const budget = await getBudgetWithSpending(budgetDoc.id, userId);

    res.status(201).json({ message: "Budget created successfully", budget });
  } catch (error) {
    next(error);
  }
};

// Get all budgets
export const getBudgets = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { isActive } = req.query;

    let query = { userId };
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const budgetDocs = await Budget.find(query).populate("categoryId", "name type").sort({ startDate: -1 });
    const budgets = await Promise.all(budgetDocs.map((b) => getBudgetWithSpending(b.id, userId)));

    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

// Get a single budget by ID
export const getBudgetById = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const budget = await getBudgetWithSpending(req.params.id, userId);

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

// Update a budget
export const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const validationErrors = validateBudgetData(req.body);
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    await Budget.findOneAndUpdate(
      { _id: id, userId },
      {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      },
      { new: true, runValidators: true }
    );

    const updated = await getBudgetWithSpending(id, userId);

    res.json({ message: "Budget updated successfully", budget: updated });
  } catch (error) {
    next(error);
  }
};

// Delete a budget
export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) throw new NotFoundError("Budget not found");

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get budget summary with spending analysis
export const getBudgetSummary = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { id } = req.params;
    if (!id) throw new NotFoundError("Budget ID is required");

    const budget = await getBudgetWithSpending(id, userId);

    res.json(budget);
  } catch (error) {
    next(error);
  }
};
