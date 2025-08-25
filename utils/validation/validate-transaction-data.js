// Helper function to validate transaction data
export const validateTransactionData = (data) => {
  const errors = [];

  if (!data.type || !["income", "expense"].includes(data.type)) {
    errors.push("Type must be either 'income' or 'expense'");
  }

  if (!data.amount || typeof data.amount !== "number" || data.amount <= 0) {
    errors.push("Amount must be a positive number");
  }

  if (!data.categoryId) {
    errors.push("Category ID is required");
  }
  return errors;
};
