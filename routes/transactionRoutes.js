import express from "express";
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";
import { isAuthenticated } from "../middlewares/authentication-middleware.js";

const router = express.Router();

// Create a new transaction
router.post("/transactions", isAuthenticated, createTransaction);

// Get all transactions for a user
router.get("/transactions", isAuthenticated, getTransactions);

// Get a single transaction by ID
router.get("/transactions/:id", isAuthenticated, getTransactionById);

// Update a transaction
router.put("/transactions/:id", isAuthenticated, updateTransaction);

// Delete a transaction
router.delete("/transactions/:id", isAuthenticated, deleteTransaction);

export default router;
