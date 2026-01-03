const express = require("express");
const router = express.Router();
const Route = require("../models/routeModel");

router.post("/create", async (req, res) => {
  try {
    const { source, destination, distance } = req.body;

    const route = await Route.create({
      source,
      destination,
      distance
    });

    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
