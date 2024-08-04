const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  rolename: {
    type: String,
    required: [true, "Role name is Required"],
  },
  wages: {
    type: Number,
    required: [true, "Wages is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // Reference to the User
});

const roleModel = mongoose.model("Roles", roleSchema);

module.exports = roleModel;
