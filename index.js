import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/test", (req, res) => {
  res.json("Server is up & running!");
});

app.listen(8021);