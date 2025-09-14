import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  deleteReminder,
} from "../controllers/reminderController.js";
import { isAuthenticated } from "../middlewares/authentication-middleware.js";

const router = express.Router();


router.post("/reminders", isAuthenticated, createReminder);

router.get("/reminders", isAuthenticated, getReminders);

router.get("/reminders/:id", isAuthenticated, getReminderById);

router.delete("/reminders/:id", isAuthenticated, deleteReminder);

export default router;