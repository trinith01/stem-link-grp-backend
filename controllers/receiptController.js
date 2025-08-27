import Receipt from "../models/Receipt.js";
import { extractReceiptData } from "../services/ocrService.js";
import { getCurrentUserId } from "../middlewares/authentication-middleware.js";
import ValidationError from "../domain/errors/validation-error.js";
import { unlinkReceiptFromTransaction } from "../services/receipt-service.js";

// Parse receipt data through Gemini API
export const parseReceipt = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const imageBuffer = req.file.buffer; // Raw image buffer for OCR

    const parsed = await extractReceiptData(imageBuffer); // Gemini OCR call

    // Holds a draft transaction to be confirmed by user later
    const draft = {
      ...parsed,
      categoryId: null, // user will pick later
      receiptId: undefined, // Placeholder until receipt is created
    };

    const receipt = await Receipt.create({
      context: parsed.note || "",
      merchantName: parsed.source || "",
      amountDetected: parsed.amount || 0,
      transactionDate: parsed.date ? new Date(parsed.date) : null,
      userId,
      draftTransaction: draft,
    });

    receipt.draftTransaction.receiptId = receipt._id; // Link receipt to draft
    await receipt.save();

    res.status(201).json({ message: "Receipt parsed successfully", receipt });
  } catch (err) {
    next(err);
  }
};

// Get all Receipts generated for a user
export const getAllReceipts = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);

    // Filter by most recent: first
    const receipts = await Receipt.find({ userId }).sort({ createdAt: -1 });

    res.json(receipts); // Return all receipts
  } catch (err) {
    next(err);
  }
};

// Get a single Receipt by ID
export const getReceiptById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req);

    // Find receipt by Id, user ID
    const receipt = await Receipt.findOne({ _id: id, userId });
    // If no match was found
    if (!receipt) throw new NotFoundError("Receipt not found");

    res.json(receipt);
  } catch (error) {
    next(error);
  }
};

// Delete a Receipt by ID
export const deleteReceipt = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const { id } = req.params; // Gets Id from request parameter

    // Find receipt by Id, user ID for deletion
    const receipt = await Receipt.findOneAndDelete({ _id: id, userId });
    if (!receipt) throw new ValidationError("Receipt not found or unauthorized");

    // Unlinks associated transaction's ReceiptId (If any)
    await unlinkReceiptFromTransaction(id, userId);

    res.json({ message: "Receipt deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Delete all Receipts of a user
export const deleteAllReceipts = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);

    // Delete all receipts by user ID
    const receipts = await Receipt.deleteMany({ userId });
    // If no receipts were found
    if (receipts.deletedCount === 0) throw new ValidationError("No Receipts found in system");

    res.json({ message: "All Receipts deleted successfully" });
  } catch (err) {
    next(err);
  }
};
