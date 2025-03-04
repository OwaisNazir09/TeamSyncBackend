const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPresent: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  },
  date: { type: Date, required: true, default: Date.now },
  startTime: { type: Date, required: true },
  breakTimes: [{ start: Date, end: Date }],
  endTime: { type: Date },
  totalHours: { type: Number },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
