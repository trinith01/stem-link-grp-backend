import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import testRoutes from "./routes/testRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import globalErrorHandlingMiddleware from "./middlewares/global-error-handling-middleware.js"

dotenv.config(); // Loads env variables
connectDB(); // Calls function to connect the database
const app = express(); // Express app instance
app.use(cors()); // Enable CORS for all routes
app.use(clerkMiddleware()); // Reads JWT token from request & sets auth object in request

// Routes
app.use("/api", testRoutes);

// Global error handler 
app.use(globalErrorHandlingMiddleware);

const PORT = process.env.PORT || 8028; // Server port
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
