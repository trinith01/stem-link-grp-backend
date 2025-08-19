import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

// Helper function to validate budget data
const validateBudgetData = (data) => {
  const errors = [];
  
  if (!data.limitAmount || typeof data.limitAmount !== 'number' || data.limitAmount <= 0) {
    errors.push("Limit amount must be a positive number");
  }
  
  if (!data.startDate) {
    errors.push("Start date is required");
  }
  
  if (!data.endDate) {
    errors.push("End date is required");
  }
  
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (startDate >= endDate) {
      errors.push("End date must be after start date");
    }
  }
  
  if (!data.categoryId) {
    errors.push("Category ID is required");
  }
  
  if (!data.userId) {
    errors.push("User ID is required");
  }
  
  if (!data.name || data.name.trim() === '') {
    errors.push("Budget name is required");
  }
  
  return errors;
};

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    const validationErrors = validateBudgetData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    const budgetData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };

    const budget = await Budget.create(budgetData);
    
    // Populate category information for response
    await budget.populate('categoryId', 'name type');
    
    const response = {
      id: budget.id,
      name: budget.name,
      limitAmount: budget.limitAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: {
        id: budget.categoryId._id.toString(),
        name: budget.categoryId.name
      },
      description: budget.description,
      isActive: budget.isActive,
      remainingAmount: budget.remainingAmount,
      spendingPercentage: budget.spendingPercentage
    };

    res.status(201).json({
      message: "Budget created successfully",
      budget: response
    });
  } catch (error) {
    console.error("Create budget error:", error);
    res.status(500).json({ 
      message: "Failed to create budget",
      error: error.message 
    });
  }
};

// Get all budgets for a user
export const getBudgets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let query = { userId };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const budgets = await Budget.find(query)
      .populate('categoryId', 'name type')
      .sort({ startDate: -1, createdAt: -1 });

    const formattedBudgets = budgets.map(budget => ({
      id: budget.id,
      name: budget.name,
      limitAmount: budget.limitAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: {
        id: budget.categoryId._id.toString(),
        name: budget.categoryId.name
      },
      description: budget.description,
      isActive: budget.isActive,
      remainingAmount: budget.remainingAmount,
      spendingPercentage: budget.spendingPercentage
    }));

    res.json(formattedBudgets);
  } catch (error) {
    console.error("Get budgets error:", error);
    res.status(500).json({ 
      message: "Failed to fetch budgets",
      error: error.message 
    });
  }
};

// Get a single budget by ID
export const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const budget = await Budget.findOne({ _id: id, userId })
      .populate('categoryId', 'name type');

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const response = {
      id: budget.id,
      name: budget.name,
      limitAmount: budget.limitAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: {
        id: budget.categoryId._id.toString(),
        name: budget.categoryId.name
      },
      description: budget.description,
      isActive: budget.isActive,
      remainingAmount: budget.remainingAmount,
      spendingPercentage: budget.spendingPercentage
    };

    res.json(response);
  } catch (error) {
    console.error("Get budget by ID error:", error);
    res.status(500).json({ 
      message: "Failed to fetch budget",
      error: error.message 
    });
  }
};

// Update a budget
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const validationErrors = validateBudgetData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    const updateData = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
    };

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name type');

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const response = {
      id: budget.id,
      name: budget.name,
      limitAmount: budget.limitAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: {
        id: budget.categoryId._id.toString(),
        name: budget.categoryId.name
      },
      description: budget.description,
      isActive: budget.isActive,
      remainingAmount: budget.remainingAmount,
      spendingPercentage: budget.spendingPercentage
    };

    res.json({ 
      message: "Budget updated successfully",
      budget: response
    });
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ 
      message: "Failed to update budget",
      error: error.message 
    });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ 
      message: "Failed to delete budget",
      error: error.message 
    });
  }
};

// Get budget summary with spending analysis
export const getBudgetSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const { budgetId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!budgetId) {
      return res.status(400).json({ message: "Budget ID is required" });
    }

    const budget = await Budget.findOne({ _id: budgetId, userId })
      .populate('categoryId', 'name type');

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Calculate actual spending for this budget period and category
    const transactions = await Transaction.find({
      userId,
      categoryId: budget.categoryId._id,
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate
      },
      type: 'expense'
    });

    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const remainingAmount = budget.limitAmount - totalSpent;
    const spendingPercentage = (totalSpent / budget.limitAmount) * 100;

    const summary = {
      id: budget.id,
      name: budget.name,
      limitAmount: budget.limitAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: {
        id: budget.categoryId._id.toString(),
        name: budget.categoryId.name
      },
      totalSpent,
      remainingAmount,
      spendingPercentage: Math.round(spendingPercentage * 100) / 100,
      isOverBudget: totalSpent > budget.limitAmount,
      transactionsCount: transactions.length
    };

    res.json(summary);
  } catch (error) {
    console.error("Get budget summary error:", error);
    res.status(500).json({ 
      message: "Failed to fetch budget summary",
      error: error.message 
    });
  }
};

// Get active budgets for a user
export const getActiveBudgets = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const currentDate = new Date();
    
    const budgets = await Budget.find({
      userId,
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    })
    .populate('categoryId', 'name type')
    .sort({ endDate: 1 });

    const formattedBudgets = budgets.map(budget => ({
      id: budget.id,
      name: budget.name,
      limitAmount: budget.limitAmount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      category: {
        id: budget.categoryId._id.toString(),
        name: budget.categoryId.name
      },
      description: budget.description,
      remainingAmount: budget.remainingAmount,
      spendingPercentage: budget.spendingPercentage
    }));

    res.json(formattedBudgets);
  } catch (error) {
    console.error("Get active budgets error:", error);
    res.status(500).json({ 
      message: "Failed to fetch active budgets",
      error: error.message 
    });
  }
};
