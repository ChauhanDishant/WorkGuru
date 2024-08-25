const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  workername: {
    type: String,
    required: [true, "Worker Name is required"],
  },
  loanDate: {
    type: String,
    required: [true, "Worker Date is required"],
  },
  loanAmount: {
    type: Number,
    required: [true, "Worker Amount is required"],
  },
  repaidAmount: {
    type: Number,
    defaultValue: 0,
    required: [true, "Repaid Amount is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total Amount is required"],
  },
  phonenumber: {
    type: String,
    required: [true, "Phone Number is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  worktype: {
    type: String,
    required: [true, "Work Type is required"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
});

const loanModel = mongoose.model("Loan", LoanSchema);

module.exports = loanModel;
