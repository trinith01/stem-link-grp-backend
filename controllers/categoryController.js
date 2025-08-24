import Category from "../models/Category.js";
import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import ConflictError from "../domain/errors/conflict-error.js";
import ValidationError from "../domain/errors/validation-error.js";
import { validateCategoryData } from "../utils/validation/validate-category-data.js";
import { defaultCategories } from "../constants/default-categories.js";
import { formatCategory } from "../utils/formatters/format-category.js";

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { name, type } = req.body;

    const validationErrors = validateCategoryData({ name, type });
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    const category = await Category.create({
      name: name.trim(),
      nameLower: name.trim().toLowerCase(),
      type,
      userId,
    });

    res.status(201).json({ ...formatCategory(category), message: "Category created successfully" });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return next(new ConflictError("Category with this name already exists"));
    }
    next(error);
  }
};

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const userId = getCurrentUserId(req);

    // Seed defaults for user if none exist at all
    const hasAny = await Category.exists({ userId });
    if (!hasAny) {
      const seeded = defaultCategories.map((c) => ({
        ...c,
        name: c.name.trim(),
        nameLower: c.name.trim().toLowerCase(),
        userId,
      }));
      // Adds array of categories
      await Category.insertMany(seeded);
    }

    const query = { userId };
    if (type && ["income", "expense"].includes(type)) {
      query.type = type;
    }
    let categories = await Category.find(query).sort({ nameLower: 1 });

    res.json(categories.map(formatCategory));
  } catch (error) {
    next(error);
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const category = await Category.findOne({ _id: id, userId });
    if (!category) throw new NotFoundError("Category not found");

    res.json(formatCategory(category));
  } catch (error) {
    next(error);
  }
};

// Update a category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);
    const { name, type } = req.body;

    const validationErrors = validateCategoryData({ name, type });
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    const update = {
      name: name.trim(),
      nameLower: name.trim().toLowerCase(),
      type,
    };

    const category = await Category.findOneAndUpdate({ _id: id, userId }, update, { new: true, runValidators: true });

    if (!category) throw new NotFoundError("Category not found");

    res.json({ message: "Category updated successfully", category: formatCategory(category) });
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError("Category with this name already exists"));
    }
    next(error);
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const category = await Category.findOneAndDelete({ _id: id, userId });
    if (!category) throw new NotFoundError("Category not found");

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
