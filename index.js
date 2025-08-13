import express from "express";

const app = express();

app.get("/api/test", (req, res) => {
  res.json("Server is up & running!");
});

app.listen(8021);