import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import Reminder from "../models/Reminder.js";
import { checkNoTransactions } from "../services/reminder-service.js";

// Test server()
export const testServer = (req, res) => {
  res.json("Server is up & running 🚀!");
};

// Test recurring reminder for no transactions
export const testReminder = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);

    await Reminder.create({
      title: "No transactions logged",
      description: "Hey, you haven't logged any transactions in 5 days. Add one today to keep your finances on track!",
      dueDate: new Date(),
      isRecurring: true,
      recurrenceInterval: 5,
      lastTriggeredDate: new Date(),
      userId,
      type: "noTransactions",
    });

    res.json({ message: "Test reminder created successfully" });
  } catch (err) {
    next(err);
  }
};