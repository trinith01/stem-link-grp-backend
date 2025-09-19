import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    dueDate: { type: Date, required: true, default: Date.now },
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly", "custom"],
      default: "once",
    },
    recurrenceInterval: { type: Number, default: null }, // Days before recurring reminder
    lastTriggeredDate: { type: Date, default: null }, // Tracks last time reminder was sent to user
    userId: { type: String, required: true, index: true }, // Clerk userId
    type: {
      type: String,
      enum: ["noTransactions", "halfLimit", "closeLimit", "fullLimit"],
      required: true,
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted response
ReminderSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Ensure virtuals are serialized
ReminderSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Index for better query performance
ReminderSchema.index({ userId: 1, dueDate: 1 });
ReminderSchema.index({ userId: 1, isRecurring: 1 });
ReminderSchema.index({ userId: 1, lastTriggeredDate: 1 });
ReminderSchema.index({ userId: 1, budgetId: 1, type: 1 }, { unique: true });

const Reminder = mongoose.model("Reminder", ReminderSchema);

export default Reminder;