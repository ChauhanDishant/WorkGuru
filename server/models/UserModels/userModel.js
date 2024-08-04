const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Business name is required"],
  },
  phonenumber: {
    type: Number,
    required: [true, "Phone-Number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  gstNumber: {
    type: String,
    required: [true, "GST Number is required"],
  },
  district: {
    type: String,
    required: [true, "District Name is required"],
  },
  taluka: {
    type: String,
    required: [true, "Taluka Name is required"],
  },
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
