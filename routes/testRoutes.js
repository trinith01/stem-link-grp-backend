import express from "express";
import { testReminder, testServer } from "../controllers/testController.js";
import { isAuthenticated } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/test", testServer); // Test endpoint
router.get("/test/transactions", isAuthenticated, testReminder); // Test reminder endpoint

export default router;
