import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import { checkNoTransactions } from "../services/reminder-service.js";

// Test server()
export const testServer = (req, res) => {
  res.json("Server is up & running 🚀!");
};

// Test recurring reminder for no transactions
export const testReminder = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    await checkNoTransactions(userId);
    res.json({ message: "Test: 5 Day No Transactions reminder executed" });
  } catch (err) {
    next(err);
  }
};