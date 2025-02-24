const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nationality: { type: String },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },

},
    { timestamps: true })

const users = mongoose.model("users", Userschema);
module.exports = users;