const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  phonenumber: {
    type: Number,
    required: [true, "Phone Number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  worktype: {
    type: String,
    enum: ["dailybased", "taskbased"],
    required: true,
  },
  dailywages: {
    type: Number,
    required: function () {
      return this.worktype === "dailybased";
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const workerModel = mongoose.model("Workers", workerSchema);

module.exports = workerModel;
