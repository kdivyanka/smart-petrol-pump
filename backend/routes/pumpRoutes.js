const express = require("express");
const router = express.Router();
const PetrolPump = require("../models/petrolPump");

router.post("/create", async (req, res) => {
  try {
    const { name, location } = req.body;

    const pump = await PetrolPump.create({
      name,
      location
    });

    res.json(pump);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
