import express from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
  getActiveBudgets,
} from "../controllers/budgetController.js";

const router = express.Router();

// Create a new budget
router.post("/budgets", createBudget);

// Get all budgets for a user
router.get("/budgets/user/:userId", getBudgets);

// Get active budgets for a user
router.get("/budgets/active/:userId", getActiveBudgets);

// Get budget summary with spending analysis
router.get("/budgets/summary/:userId", getBudgetSummary);

// Get a single budget by ID
router.get("/budgets/:id", getBudgetById);

// Update a budget
router.put("/budgets/:id", updateBudget);

// Delete a budget
router.delete("/budgets/:id", deleteBudget);

export default router;
