import Receipt from "../models/Receipt.js";
import Transaction from "../models/Transaction.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../middlewares/s3-upload-middleware.js";

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

// Generates a signed URL for a receipt stored in S3
export async function getSignedReceiptUrl(key) {
  if (!key) return null;
  // Create a command to get the S3 object
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  });
  // Generates a pre-signed URL that expires in 1 hour (3600 seconds)
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
}

// Find all receipts for a user (And generates signed URLs)
export async function findReceiptsForUser(userId) {
  // Find all receipts for userId
  const receipts = await Receipt.find({ userId }).sort({ createdAt: -1 });

  // Promise.all: Process all receipts concurrently
  return Promise.all(
    receipts.map(async (receipt) => {
      // Extract the S3 key from full S3 URL
      const key = receipt.fileUrl.includes("amazonaws.com")
        ? receipt.fileUrl.split("/").pop()
        : receipt.fileUrl;
      
      // Convert Mongoose document to JS object
      const obj = receipt.toObject({ virtuals: true }); // plain object + virtuals
      // Manually set id & remove internal Mongoose fields
      obj.id = receipt._id.toString();
      delete obj._id;
      delete obj.__v;

      // Override fileUrl with signed URL
      obj.fileUrl = await getSignedReceiptUrl(key);

      return obj;
    })
  );
}

// Find receipts by ID (And generate signed URL)
export async function findReceiptById(userId, id) {
  // Find receipt by userId & receipt Id
  const receipt = await Receipt.findOne({ _id: id, userId });
  if (!receipt) return null;

  // Extract the S3 key from full S3 URL
  const key = receipt.fileUrl.includes("amazonaws.com")
    ? receipt.fileUrl.split("/").pop()
    : receipt.fileUrl;

  // Convert Mongoose document to JS object
  const obj = receipt.toObject({ virtuals: true }); // plain object + virtuals
  
  // Manually set id & remove internal Mongoose fields
  obj.id = receipt._id.toString();
  delete obj._id;
  delete obj.__v;
  
  // Override fileUrl with signed URL
  obj.fileUrl = await getSignedReceiptUrl(key);

  return obj;
}