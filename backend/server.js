// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const tripRoutes = require("./routes/tripRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // allow frontend to call backend
app.use(express.json()); // read JSON body

// Simple test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is working!" });
});

// Trip routes
app.use("/api/trip", tripRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
