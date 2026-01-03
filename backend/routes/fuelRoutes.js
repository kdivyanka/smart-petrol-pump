const express = require("express");
const router = express.Router();
const Fuel = require("../models/fuel");

router.post("/create", async (req, res) => {
  try {
    const { userId, routeId, requiredFuel, decision } = req.body;

    const fuel = await Fuel.create({
      userId,
      routeId,
      requiredFuel,
      decision
    });

    res.json(fuel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
