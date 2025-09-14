export const formatReminder = (reminder) => {
  return {
    id: reminder.id,
    title: reminder.title,
    description: reminder.description,
    dueDate: reminder.dueDate,
    isRecurring: reminder.isRecurring,
    frequency: reminder.frequency,
    recurrenceInterval: reminder.recurrenceInterval,
    lastTriggeredDate: reminder.lastTriggeredDate,
    userId: reminder.userId,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  };
};