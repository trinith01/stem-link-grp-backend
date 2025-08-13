import express from "express";
import { testServer } from "../controllers/testController.js";

const router = express.Router();

router.get("/test", testServer); // Test endpoint

export default router;
