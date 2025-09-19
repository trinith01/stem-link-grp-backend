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
    type: reminder.type,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  };
};