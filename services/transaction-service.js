import Transaction from "../models/Transaction.js";

// Sum total amount spent for a category in a given date range.
export async function getTotalSpent(userId, categoryId, startDate, endDate) {
  const [{ total = 0 } = {}] = await Transaction.aggregate([
    { $match: { userId, categoryId, date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return total;
}

// Sum of financial stats for given date range
export const getMonthlySummaryForUser = async (userId, month, year) => {
  const now = new Date(); // Default: current date
  const monthInt = month ? parseInt(month, 10) : now.getMonth() + 1; // JS months are 0-indexed
  const yearInt = year ? parseInt(year, 10) : now.getFullYear();

  // Set date range for calculations
  const startDate = new Date(yearInt, monthInt - 1, 1);
  const endDate = new Date(yearInt, monthInt, 1);

  // Calculates sum using DB query
  const result = await Transaction.aggregate([
    { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } }
  ]);

  const income = result.find((r) => r._id === "income")?.total || 0;
  const expense = result.find((r) => r._id === "expense")?.total || 0;
  const balance = income - expense;
  const balanceRate = income > 0 ? (balance / income) * 100 : 0;

  const round = (num, decimals = 0) => Number(num.toFixed(decimals));

  // Returns an object
  return {
    month: monthInt,
    year: yearInt,
    income: round(income),
    expense: round(expense),
    balance: round(balance),
    balanceRate: parseFloat(balanceRate.toFixed(2)),
  };
};

// Chart data based on filters
export const getChartDataForUser = async (userId, month, year, type) => {
  const now = new Date(); // Default: current date
  const monthInt = month ? parseInt(month, 10) : now.getMonth() + 1;
  const yearInt = year ? parseInt(year, 10) : now.getFullYear();

  // Set date range for calculations
  const startDate = new Date(yearInt, monthInt - 1, 1);
  const endDate = new Date(yearInt, monthInt, 1);

  // Filter documents by userId & date
  const matchStage = { userId, date: { $gte: startDate, $lt: endDate } };

  // Filter by type
  if (type) matchStage.type = type;

  // Calculates sum using DB query
  const result = await Transaction.aggregate([
    { $match: matchStage },
    { $group: { _id: { $dayOfMonth: "$date" }, total: { $sum: "$amount" } } },
    { $sort: { _id: 1 } },
  ]);

  // Returns array of objects
  return result.map((r) => ({
    date: `${monthInt}/${r._id}`,
    value: r.total,
  }));
};
