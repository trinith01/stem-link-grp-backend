import express from "express";
import { isAuthenticated } from "../middlewares/authentication-middleware.js";
import { uploadReceipt } from "../middlewares/s3-upload-middleware.js";
import { parseReceipt, getAllReceipts, deleteReceipt, deleteAllReceipts, getReceiptById } from "../controllers/receiptController.js";

const router = express.Router();

// Create receipt by parsing image using OCR
router.post("/receipts/parse", isAuthenticated, uploadReceipt.single("receipt"), parseReceipt);
// Get all receipts
router.get("/receipts", isAuthenticated, getAllReceipts);
// Get receipt by ID
router.get("/receipts/:id", isAuthenticated, getReceiptById);
// Delete receipt by ID
router.delete("/receipts/:id", isAuthenticated, deleteReceipt);
// Delete all receipts
router.delete("/receipts", isAuthenticated, deleteAllReceipts);

export default router;
