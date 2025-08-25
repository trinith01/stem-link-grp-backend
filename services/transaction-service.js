import Transaction from "../models/Transaction.js";

// Sum total amount spent for a category in a given date range.
export async function getTotalSpent(userId, categoryId, startDate, endDate) {
  const [{ total = 0 } = {}] = await Transaction.aggregate([
    {
      $match: {
        userId,
        categoryId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return total;
}
