const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema({
  userId: String,
  routeId: String,
  requiredFuel: Number,
  decision: String
});

const Fuel = mongoose.model("Fuel", fuelSchema);
module.exports = Fuel;
