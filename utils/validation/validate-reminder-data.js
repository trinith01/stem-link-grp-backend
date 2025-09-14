export const validateReminderData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required");
  } else if (data.title.trim().length > 100) {
    errors.push("Title cannot exceed 100 characters");
  }

  if (data.description && data.description.trim().length > 500) {
    errors.push("Description cannot exceed 500 characters");
  }

  if (!data.dueDate) {
    errors.push("Due date is required");
  } else if (new Date(data.dueDate) < new Date()) {
    errors.push("Due date cannot be in the past");
  }

  if (data.isRecurring) {
    if(!["daily", "weekly", "monthly", "custom"].includes(data.frequency)) {
      errors.push("Frequency must be one of: daily, weekly, monthly, custom");
    } 
    if (data.frequency === "custom") {
      if (!data.recurrenceInterval || data.recurrenceInterval <= 0) {
        errors.push("Recurrence interval must be a positive number for custom frequency");
      }
    }
  }


  return errors;
};