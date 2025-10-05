import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import Transaction from "../models/Transaction.js";
import { assertCategoryOwnership } from "../utils/ownership/assert-category-ownership.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import ValidationError from "../domain/errors/validation-error.js";
import { validateTransactionData } from "../utils/validation/validate-transaction-data.js";
import { markReceiptProcessed, markReceiptUnprocessed } from "../services/receipt-service.js";
import Budget from "../models/Budget.js";
import { checkBudgetAndCreateReminders } from "../services/budget-service.js";
import { getChartDataForUser, getMonthlySummaryForUser } from "../services/transaction-service.js";

// Create a new transaction
export const createTransaction = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);

    const validationErrors = validateTransactionData(req.body);
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    // Ensure category belongs to this user
    await assertCategoryOwnership(userId, req.body.categoryId);

    const transactionData = {
      ...req.body,
      userId,
      date: req.body.date ? new Date(req.body.date) : new Date(),
    };

    const transaction = await Transaction.create(transactionData);

    // If transaction is linked to a receipt, mark it processed
    if (transaction.receiptId) {
      await markReceiptProcessed(transaction.receiptId, userId);
    }

    // Find budgets for this category that are active in this date range
    const budgets = await Budget.find({
      userId,
      categoryId: req.body.categoryId,
      isActive: true,
      startDate: { $lte: transaction.date },
      endDate: { $gte: transaction.date }
    });

    // For each budget create relevant reminders
    for (const budget of budgets) {
      await checkBudgetAndCreateReminders(budget.id, userId);
    }

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get all transactions for a user
export const getTransactions = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { month, year, type } = req.query;

    const filter = { userId };

    // Optional type filter (income/expense)
    if (type) {
      filter.type = type;
    }

    // Optional month/year filter
    if (month && year) {
      const startDate = new Date(year, month - 1, 1); // month is 0-indexed
      const endDate = new Date(year, month, 1); // next month
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(filter).populate("categoryId", "name type").sort({ date: -1, createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const transaction = await Transaction.findOne({ _id: id, userId }).populate("categoryId", "name type");

    if (!transaction) throw new NotFoundError("Transaction not found");

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const validationErrors = validateTransactionData(req.body);
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    // Ensure category belongs to this user
    await assertCategoryOwnership(userId, req.body.categoryId);

    const updateData = { ...req.body, date: req.body.date ? new Date(req.body.date) : undefined };

    const updated = await Transaction.findOneAndUpdate({ _id: id, userId }, updateData, { new: true, runValidators: true });

    // Find budgets for this category that are active in this date range
    const budgets = await Budget.find({
      userId,
      categoryId: req.body.categoryId,
      isActive: true,
      startDate: { $lte: updated.date },
      endDate: { $gte: updated.date }
    });

    for (const budget of budgets) {
      await checkBudgetAndCreateReminders(budget.id, userId);
    }

    if (!updated) throw new NotFoundError("Transaction not found");

    res.json({ message: "Transaction updated successfully", transaction: updated });
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) throw new NotFoundError("Transaction not found");

    // If transaction is linked to a receipt, mark it unprocessed
    if (transaction.receiptId) {
      await markReceiptUnprocessed(transaction.receiptId, userId);
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get monthly stats for all transactions
export const getMonthlySummary = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { month, year } = req.query;

    // calculate the monthly summary
    const summary = await getMonthlySummaryForUser(userId, month, year);

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

// Get data for financial chart
export const getChartData = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { month, year, type } = req.query;

    // calculate chart-specific data
    const chartData = await getChartDataForUser(userId, month, year, type);

    res.json(chartData);
  } catch (error) {
    next(error);
  }
};
