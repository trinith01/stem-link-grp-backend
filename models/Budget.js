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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    description: {
      type: String,
      default: "",
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
    toObject: { virtuals: true }
  }
);

// Virtual for formatted response
BudgetSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Virtual for remaining amount (calculated field)
BudgetSchema.virtual('remainingAmount').get(function() {
  // This would be calculated based on actual spending
  // For now, return the limit amount
  return this.limitAmount;
});

// Virtual for spending percentage
BudgetSchema.virtual('spendingPercentage').get(function() {
  // This would be calculated based on actual spending vs limit
  // For now, return 0
  return 0;
});

// Ensure virtuals are serialized
BudgetSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Index for efficient queries
BudgetSchema.index({ userId: 1, categoryId: 1 });
BudgetSchema.index({ startDate: 1, endDate: 1 });
BudgetSchema.index({ isActive: 1 });

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
