const express = require("express");
const router = express.Router();
const authMiddleware = require("./../../../middlewares/authMiddleware");
const {
  addAttendance,
  getAttendance,
} = require("./../../../controllers/WorkersControllers/AttendanceControllers/Attendance");

// POST || Add the Data
router.post("/addattendance", authMiddleware, addAttendance);

// GET || Retrieving the Data
router.get("/listofattendance", authMiddleware, getAttendance);

module.exports = router;
