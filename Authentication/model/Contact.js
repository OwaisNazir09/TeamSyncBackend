const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    phone_number: { type: String, required: true },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip_code: { type: String },
    country: { type: String }
  },
  { timestamps: true }
);

const UserContact = mongoose.model("UserContact", contactSchema);
module.exports = UserContact;
