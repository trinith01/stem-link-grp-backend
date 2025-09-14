import Reminder from "../models/Reminder.js";
import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import ValidationError from "../domain/errors/validation-error.js";
import { validateReminderData } from "../utils/validation/validate-reminder-data.js";
import { formatReminder } from "../utils/formatters/format-reminder.js";

// Create a new reminder
export const createReminder = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { title, description, dueDate, priority, category } = req.body;

    const validationErrors = validateReminderData({
      title,
      description,
      dueDate,
      isRecurring,
      frequency,
      recurrenceInterval,
    });
    if (validationErrors.length > 0) {
      throw new ValidationError("Validation failed", validationErrors);
    }

    const reminder = await Reminder.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      dueDate: new Date(dueDate),
      isRecurring: isRecurring || false,
      frequency: isRecurring ? frequency : null,
      recurrenceInterval: isRecurring && frequency === "custom" ? recurrenceInterval : null,
      userId,
    });

    res.status(201).json({
      ...formatReminder(reminder),
      message: "Reminder created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all reminders with optional filters
export const getReminders = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { upcoming } = req.query;
    const query = { userId };

    // Filter for upcoming reminders (due date in future)
    if (upcoming === "true") {
      query.dueDate = { $gte: new Date() };
    }

    let reminders = await Reminder.find(query).sort({
      dueDate: 1,
    });

    res.json(reminders.map(formatReminder));
  } catch (error) {
    next(error);
  }
};


// Get a single reminder by ID
export const getReminderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const reminder = await Reminder.findOne({ _id: id, userId });
    if (!reminder) throw new NotFoundError("Reminder not found");

    res.json(formatReminder(reminder));
  } catch (error) {
    next(error);
  }
};

// Delete a reminder
export const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    const reminder = await Reminder.findOneAndDelete({ _id: id, userId });
    if (!reminder) throw new NotFoundError("Reminder not found");

    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    next(error);
  }
};

