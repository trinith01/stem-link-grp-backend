// Helper function to validate budget data
export const validateBudgetData = (data) => {
  const errors = [];
  if (!data.limitAmount || typeof data.limitAmount !== "number" || data.limitAmount <= 0) {
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
    if (startDate >= endDate) errors.push("End date must be after start date");
  }

  if (!data.categoryId) {
    errors.push("Category ID is required");
  }
  if (!data.name || data.name.trim() === "") {
    errors.push("Budget name is required");
  }

  return errors;
};
