const mongoose = require('mongoose');
const employmentschema = new mongoose.Schema({

    job_title: { type: String, required: true },
    employee_id: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    employment_type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
    employee_status: { type: String, enum: ['Active', 'On Leave', 'Resigned', 'Terminated'], default: 'Active' },
    work_location: { type: String },
    shift_timing: { type: String },
    work_email: { type: String, unique: true },

},
    { timestamps: true })

const userEmployment = mongoose.model("userEmployment", employmentschema);
module.exports = userEmployment;