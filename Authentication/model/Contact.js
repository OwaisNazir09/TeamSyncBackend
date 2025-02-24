const mongoose = require('mongoose');

const contactschema = new mongoose.Schema({

  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip_code: { type: String },
  country: { type: String }

},
  { timestamps: true })

const userContact = mongoose.model("userContact", contactschema);
module.exports = userContact;