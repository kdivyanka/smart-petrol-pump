const express = require("express");
const router = express.Router();

const { planTrip } = require("../services/tripService");

router.post("/", async (req, res) => {
  try {
    const result = await planTrip(req.body);
    res.json(result);
  } catch (err) {
    console.error("Error in /api/trip:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
