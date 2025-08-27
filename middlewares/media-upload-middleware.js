import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

export const uploadReceipt = multer({
  storage: multer.memoryStorage(), // Keep file in memory for OCR
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB limit
});
