import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
  {
    merchantName: { type: String, default: "" },
    amountDetected: { type: Number, default: 0 },
    context: { type: String, default: "", trim: true },
    transactionDate: { type: Date },
    isProcessed: { type: Boolean, default: false },
    userId: { type: String, required: true, index: true },
    draftTransaction: { type: Object, default: null },
  },
  { timestamps: true }
);

// Adds virtual `id` field for consistent client-side usage
ReceiptSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Transforms JSON output to hide internal Mongo fields
ReceiptSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Receipt = mongoose.model("Receipt", ReceiptSchema);
export default Receipt;
