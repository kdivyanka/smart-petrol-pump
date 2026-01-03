const express = require("express");
const User = require("../models/user");

const router = express.Router();

// LOGIN / CREATE USER (NO AUTH)
router.post("/", async (req, res) => {
  try {
    const { name, email, mileage, tankCapacity } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // 🔥 FIND USER
    let user = await User.findOne({ email });

    // 🔥 IF NOT EXISTS → CREATE
    if (!user) {
      user = await User.create({
        name,
        email,
        mileage,
        tankCapacity
      });
    }

    res.json({
      message: "User ready",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
