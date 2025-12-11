const mongoose = require("mongoose");

const petrolPumpSchema = new mongoose.Schema({
  name: String,
  location: String
});

const PetrolPump = mongoose.model("PetrolPump", petrolPumpSchema);
module.exports = PetrolPump;
