import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// Create a new transaction
router.post("/transactions", createTransaction);

// Get all transactions for a user
router.get("/transactions/user/:userId", getTransactions);

// Get a single transaction by ID
router.get("/transactions/:id", getTransactionById);

// Update a transaction
router.put("/transactions/:id", updateTransaction);

// Delete a transaction
router.delete("/transactions/:id", deleteTransaction);

export default router;
