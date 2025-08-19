import Transaction from "../models/Transaction.js";

// Helper function to validate transaction data
const validateTransactionData = (data) => {
  const errors = [];
  
  if (!data.type || !["income", "expense"].includes(data.type)) {
    errors.push("Type must be either 'income' or 'expense'");
  }
  
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push("Amount must be a positive number");
  }
  
  if (!data.categoryId) {
    errors.push("Category ID is required");
  }
  
  if (!data.userId) {
    errors.push("User ID is required");
  }
  
  return errors;
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const validationErrors = validateTransactionData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    const transactionData = {
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const transaction = await Transaction.create(transactionData);
    
    // Populate category information for response
    await transaction.populate('categoryId', 'name type');
    
    const response = {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note,
      category: {
        id: transaction.categoryId._id.toString(),
        name: transaction.categoryId.name
      },
      source: transaction.source
    };

    res.status(201).json({
      id: transaction.id,
      message: "Transaction created successfully"
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ 
      message: "Failed to create transaction",
      error: error.message 
    });
  }
};

// Get all transactions for a user
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const transactions = await Transaction.find({ userId })
      .populate('categoryId', 'name type')
      .sort({ date: -1, createdAt: -1 });

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note,
      category: {
        id: transaction.categoryId._id.toString(),
        name: transaction.categoryId.name
      },
      source: transaction.source
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ 
      message: "Failed to fetch transactions",
      error: error.message 
    });
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const transaction = await Transaction.findOne({ _id: id, userId })
      .populate('categoryId', 'name type');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const response = {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note,
      category: {
        id: transaction.categoryId._id.toString(),
        name: transaction.categoryId.name
      },
      source: transaction.source
    };

    res.json(response);
  } catch (error) {
    console.error("Get transaction by ID error:", error);
    res.status(500).json({ 
      message: "Failed to fetch transaction",
      error: error.message 
    });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const validationErrors = validateTransactionData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    const updateData = {
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    };

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name type');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ 
      message: "Failed to update transaction",
      error: error.message 
    });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ 
      message: "Failed to delete transaction",
      error: error.message 
    });
  }
};
