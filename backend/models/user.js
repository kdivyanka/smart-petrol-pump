const mongoose = require("mongoose");

// Define structure of User document
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mileage: Number,
  tankCapacity: Number
});

// Create User model (collection will be "users")
const User = mongoose.model("User", userSchema);

// Export so server.js can use it
module.exports = User;
