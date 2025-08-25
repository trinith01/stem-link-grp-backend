import ValidationError from "../../domain/errors/validation-error.js";
import Category from "../../models/Category.js";

export const assertCategoryOwnership = async (userId, categoryId) => {
  const exists = await Category.exists({ _id: categoryId, userId });
  if (!exists) {
    throw new ValidationError("Invalid category — not found or doesn't belong to user");
  }
};
