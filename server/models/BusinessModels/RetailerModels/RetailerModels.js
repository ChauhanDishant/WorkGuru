const mongoose = require("mongoose");

const retailerSchema = new mongoose.Schema({
  storename: {
    type: String,
    required: [true, "Store name is required"],
  },
  firstname: {
    type: String,
    required: [true, "First name is required"],
  },
  lastname: {
    type: String,
    required: [true, "Last name is required"],
  },
  contactnumber: {
    type: Number,
    required: [true, "Contact number is required"],
  },
  contactemail: {
    type: String,
    required: [true, "Contact email is required"],
  },
  contactaddress: {
    type: String,
    required: [true, "Contact address is required"],
  },
  selectedState: {
    type: String,
    required: [true, "State is required"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
  },
  postalcode: {
    type: String,
    required: [true, "Postal Code is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // Reference to the User
});

const retailerModel = mongoose.model("Retailers", retailerSchema);

module.exports = retailerModel;
