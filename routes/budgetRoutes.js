import express from "express";
import { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget, getBudgetSummary } from "../controllers/budgetController.js";
import { isAuthenticated } from "../middlewares/authentication-middleware.js";

const router = express.Router();

// Create a new budget
router.post("/budgets", isAuthenticated, createBudget);

// Get all budgets for a user
router.get("/budgets", isAuthenticated, getBudgets);

// Get budget summary with spending analysis
router.get("/budgets/:id/summary", isAuthenticated, getBudgetSummary);

// Get a single budget by ID
router.get("/budgets/:id", isAuthenticated, getBudgetById);

// Update a budget
router.put("/budgets/:id", isAuthenticated, updateBudget);

// Delete a budget
router.delete("/budgets/:id", isAuthenticated, deleteBudget);

export default router;
