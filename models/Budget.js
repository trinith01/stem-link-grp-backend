import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    limitAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted response
BudgetSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Ensure virtuals are serialized
BudgetSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Index for efficient queries
BudgetSchema.index({ userId: 1, categoryId: 1, startDate: 1, endDate: 1, isActive: 1 }, { unique: true });
BudgetSchema.index({ userId: 1, isActive: 1 });

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
