const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
},{ timestamps: true }
);

const OTPModel = mongoose.model("OTP", otpSchema);

module.exports = OTPModel;