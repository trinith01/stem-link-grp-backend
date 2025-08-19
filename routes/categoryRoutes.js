import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesByType,
} from "../controllers/categoryController.js";

const router = express.Router();

// Create a new category
router.post("/categories", createCategory);

// Get all categories (with optional type filter)
router.get("/categories", getCategories);

// Get categories by type
router.get("/categories/type/:type", getCategoriesByType);

// Get a single category by ID
router.get("/categories/:id", getCategoryById);

// Update a category
router.put("/categories/:id", updateCategory);

// Delete a category
router.delete("/categories/:id", deleteCategory);

export default router;
