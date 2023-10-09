const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  passwords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Passwords" }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
