// models/pendingUserModel.js
const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // already hashed
  otp: String, // hashed OTP
  otpExpires: Date,
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
