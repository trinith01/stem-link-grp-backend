import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import testRoutes from "./routes/testRoutes.js";

dotenv.config(); // Loads env variables
connectDB(); // Calls function to connect the database
const app = express(); // Express app instance
app.use(cors()); // CORS Middleware

// Routes
app.use("/api", testRoutes);

const PORT = process.env.PORT || 8028; // Server port
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
