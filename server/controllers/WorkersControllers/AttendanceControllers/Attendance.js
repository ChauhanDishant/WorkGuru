const mongoose = require("mongoose");
const Attendance = require("./../../../models/WorkersModels/AttendanceModels/AttendanceModels");
const Role = mongoose.model("Roles");
const Worker = mongoose.model("Workers");

const addAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res
        .status(409)
        .send({ message: "User not found", success: false });
    }

    const { date, workers } = req.body;

    if (!date) {
      return res
        .status(400)
        .send({ message: "Date is required", success: false });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .send({ message: "Invalid date format", success: false });
    }

    // Extract worker IDs from the request body
    const workerIds = workers.map(
      (worker) => new mongoose.Types.ObjectId(worker.worker)
    );

    // Check if attendance already exists for any of the workers on the given date
    const existingAttendance = await Attendance.find({
      date: parsedDate,
      worker: { $in: workerIds },
    }).exec();

    if (existingAttendance.length > 0) {
      return res.status(409).send({
        message:
          "Attendance has already been recorded for one or more workers on this date",
        success: false,
      });
    }

    const attendanceData = await Promise.all(
      workers.map(async (worker) => {
        let roleId = null;

        if (worker.role) {
          const role = await Role.findOne({ rolename: worker.role }).exec();
          if (!role) {
            throw new Error(`Role "${worker.role}" not found`);
          }
          roleId = role._id;
        }

        // Validate and convert the worker ID
        const workerId = new mongoose.Types.ObjectId(worker.worker);
        if (!mongoose.Types.ObjectId.isValid(workerId)) {
          throw new Error("Invalid worker ID");
        }

        return {
          worker: workerId,
          isPresent: !!worker.isPresent,
          leaveApproved: !!worker.leaveApproved,
          workType: worker.workType || "dailybased",
          role: roleId,
          quantity: worker.quantity || 0,
          wages: worker.wages || 0,
          total: worker.total || 0,
          borrowedMoney: worker.borrowedMoney || 0,
          date: parsedDate,
          user: userId,
        };
      })
    );

    // Insert all attendance records at once
    await Attendance.insertMany(attendanceData);

    return res
      .status(201)
      .send({ message: "Attendance Added Successfully", success: true });
  } catch (err) {
    console.error("Error in addAttendance:", err.message);
    return res.status(500).send({
      message: err.message || "Internal Server Error",
      success: false,
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }
    const attendance = await Attendance.find({ user: userId });
    console.log(attendance, userId);
    res.status(200).json({
      message: "Attendance fetched Successfully",
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Retrieving the data",
      success: false,
    });
  }
};

module.exports = { addAttendance, getAttendance };
