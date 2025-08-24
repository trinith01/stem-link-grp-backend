import Category from "../models/Category.js";
import { defaultCategories } from "../constants/default-categories.js";
import { formatCategory } from "../utils/formatters/format-category.js";

// Helper function to validate category data
const validateCategoryData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push("Category name is required");
  }
  
  if (!data.type || !["income", "expense"].includes(data.type)) {
    errors.push("Type must be either 'income' or 'expense'");
  }
  
  return errors;
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const validationErrors = validateCategoryData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({ ...formatCategory(category), message: "Category created successfully" });
  } catch (error) {
    console.error("Create category error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Failed to create category",
      error: error.message 
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    // Seed defaults for user if none exist at all
    const seeded = defaultCategories.map((c) => ({
      ...c,
      name: c.name.trim(),
      nameLower: c.name.trim().toLowerCase(),
      userId,
    }));
    // Adds array of categories
    await Category.insertMany(seeded);
    let query = {};
    if (type && ["income", "expense"].includes(type)) {
      query.type = type;
    }

    let categories = await Category.find(query).sort({ name: 1 });

    res.json(categories.map(formatCategory));
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ 
      message: "Failed to fetch categories",
      error: error.message 
    });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(formatCategory(category));
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({ 
      message: "Failed to fetch category",
      error: error.message 
    });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const validationErrors = validateCategoryData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category: formatCategory(category) });
  } catch (error) {
    console.error("Update category error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Failed to update category",
      error: error.message 
    });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ 
      message: "Failed to delete category",
      error: error.message 
    });
  }
};

// Get categories by type
export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ 
        message: "Type must be either 'income' or 'expense'" 
      });
    }

    const categories = await Category.find({ type }).sort({ name: 1 });
    res.json(categories.map(formatCategory));
  } catch (error) {
    console.error("Get categories by type error:", error);
    res.status(500).json({ 
      message: "Failed to fetch categories",
      error: error.message 
    });
  }
};
