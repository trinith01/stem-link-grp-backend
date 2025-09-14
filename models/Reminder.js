import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "custom"],
      default: null,
    },
    recurrenceInterval: {
      type: Number,
      default: null,
    },
    lastTriggeredDate: {
      type: Date,
      default: null,
    }, 
    userId: {
      type: String, // Clerk userId
      required: true,
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

const Reminder = mongoose.model("Reminder", ReminderSchema);

export default Reminder;