// Helper function to validate category data
export const validateCategoryData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Category name is required");
  }
  
  if (!data.type || !["income", "expense"].includes(data.type)) {
    errors.push("Type must be either 'income' or 'expense'");
  }
  return errors;
};
