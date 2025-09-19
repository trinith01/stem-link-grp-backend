import express from "express";
import { testReminder, testServer } from "../controllers/testController.js";

const router = express.Router();

router.get("/test", testServer); // Test endpoint
router.get("/test/transactions", testReminder); // Test reminder endpoint

export default router;
