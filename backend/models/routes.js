const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  source: String,
  destination: String,
  distance: Number
});

module.exports = mongoose.model("Route", routeSchema);
