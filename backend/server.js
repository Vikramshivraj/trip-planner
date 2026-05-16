const express = require("express");
const cors = require("cors");

require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});