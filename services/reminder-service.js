import Transaction from "../models/Transaction.js";
import Reminder from "../models/Reminder.js";

// Check last transaction date & generate reminders
export async function checkNoTransactions(userId) {
  const lastTransaction = await Transaction.findOne({ userId }).sort({ date: -1 });
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // Time in milliseconds

  if (!lastTransaction || lastTransaction.date < fiveDaysAgo) {
    await Reminder.create({
      title: "No transactions logged",
      description: "Hey, you haven't logged any transactions in 5 days. Add one today to keep your finances on track!",
      dueDate: new Date(),
      isRecurring: true,
      recurrenceInterval: 5,
      lastTriggeredDate: new Date(),
      userId,
      type: "noTransactions"
    });
  }
}
