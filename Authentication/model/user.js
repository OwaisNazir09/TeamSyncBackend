const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nationality: { type: String },

    contact: {
        email: { type: String, required: true, unique: true },
        phone_number: { type: String, required: true },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: String },
        country: { type: String }
    },
    employment: {
        job_title: { type: String, required: true },
        employee_id: { type: String, required: true, unique: true },
        department: { type: String, required: true },
        employment_type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },        
        employee_status: { type: String, enum: ['Active', 'On Leave', 'Resigned', 'Terminated'], default: 'Active' },
        work_location: { type: String },
        shift_timing: { type: String },
        work_email: { type: String, unique: true },
    }
}, 
{ timestamps: true })

const users = mongoose.model("users", Userschema);
module.exports = users;