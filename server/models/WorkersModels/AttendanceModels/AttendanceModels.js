const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workers",
    required: true,
  },
  isPresent: {
    type: Boolean,
    default: false,
  },
  leaveApproved: {
    type: Boolean,
    default: false,
  },
  workType: {
    type: String,
    enum: ["dailybased", "taskbased"],
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roles",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  wages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  borrowedMoney: {
    type: Number,
    default: 0,
  },
  paymentMoney: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
