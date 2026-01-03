const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const pumpRoutes = require("./routes/pumpRoutes");
const routeRoutes = require("./routes/routeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is working" });
});

// 🔥 API ROUTES
app.use("/api/user", userRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/pumps", pumpRoutes);
app.use("/api/routes", routeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
