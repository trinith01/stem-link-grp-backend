import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import Transaction from "../models/Transaction.js";
import { assertCategoryOwnership } from "../utils/ownership/assert-category-ownership.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import ValidationError from "../domain/errors/validation-error.js";
import { validateTransactionData } from "../utils/validation/validate-transaction-data.js";

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

    const transactions = await Transaction.find({ userId }).populate("categoryId", "name type").sort({ date: -1, createdAt: -1 });

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

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};
