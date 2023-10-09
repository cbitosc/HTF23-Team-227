const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  source: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  strength: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
});

const Passwords = mongoose.model("Passwords", passwordSchema);

module.exports = Passwords;
