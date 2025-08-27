import Receipt from "../models/Receipt.js";
import Transaction from "../models/Transaction.js";

// Marks a receipt as processed
export async function markReceiptProcessed(receiptId, userId) {
  // If a transaction is created, from a receipt
  if (!receiptId) return;
  await Receipt.updateOne(
    { _id: receiptId, userId }, 
    { $set: { isProcessed: true } 
  });
}

// Marks a receipt as unprocessed
export async function markReceiptUnprocessed(receiptId, userId) {
  // If a transaction is deleted, that was created from a receipt
  if (!receiptId) return;
  await Receipt.updateOne(
    { _id: receiptId, userId },
    { $set: { isProcessed: false } }
  );
}

// Unlinks a deleted receipt from related transaction
export async function unlinkReceiptFromTransaction(receiptId, userId) {
  // If a receipt is deleted, no transaction would point to that receipt
  if (!receiptId) return;
  await Transaction.updateOne(
    { receiptId, userId },
    { $set: { receiptId: null } }
  );
}