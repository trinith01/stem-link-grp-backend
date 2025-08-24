import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Normalized for case-insensitive unique index
    nameLower: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      trim: true,
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
    toObject: { virtuals: true }
  }
);

// Virtual for convenience if need elsewhere
CategorySchema.virtual('id').get(function() {
  return this._id.toString();
});

// Keep output clean & consistent (adds id, removes _id/__v)
CategorySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Composite index: Ensures one user can’t have 2 categories with same name (case-insensitive).
CategorySchema.index({ userId: 1, nameLower: 1 }, { unique: true });

// Ensure nameLower stays in sync on create/update
CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.nameLower = this.name.toLowerCase();
  }
  next();
});

// Ensure nameLower is updated if name changes during findOneAndUpdate
CategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update?.name) {
    update.nameLower = update.name.toLowerCase();
    this.setUpdate(update);
  }
  next();
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
