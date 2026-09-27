const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/foods");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const app = express();

app.use(cors());

// Allow larger JSON requests because food images
// are currently sent as Base64 data.
app.use(express.json({ limit: "20mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "RasoiHub Backend is running!",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      success: true,
      message: "RasoiHub database connected successfully!",
      result: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`RasoiHub backend running on http://localhost:${PORT}`);
});