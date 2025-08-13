import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

app.get("/api/test", (req, res) => {
  res.json("Server is up & running!");
});

const PORT = process.env.PORT || 8028; // Server port
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
