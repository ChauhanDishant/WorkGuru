const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  departmentname: { type: String, required: true },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
});

const departmentModel = mongoose.model("Departments", departmentSchema);

module.exports = departmentModel;
