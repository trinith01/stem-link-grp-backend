import express from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { isAuthenticated } from "../middlewares/authentication-middleware.js";

const router = express.Router();

// Create a new category
router.post("/categories", isAuthenticated, createCategory);

// Get all categories (with optional type filter)
router.get("/categories", isAuthenticated, getCategories);

// Get a single category by ID
router.get("/categories/:id", isAuthenticated, getCategoryById);

// Update a category
router.put("/categories/:id", isAuthenticated, updateCategory);

// Delete a category
router.delete("/categories/:id", isAuthenticated, deleteCategory);

export default router;
