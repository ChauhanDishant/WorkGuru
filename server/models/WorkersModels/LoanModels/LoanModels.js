const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workers", // Assuming you have a Worker model
    required: [true, "Worker reference is required"],
  },
  loanDate: {
    type: Date,
    required: [true, "Loan Date is required"],
  },
  loanAmount: {
    type: Number,
    required: [true, "Loan Amount is required"],
  },
  repaidAmount: {
    type: Number,
    default: 0,
    required: [true, "Repaid Amount is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total Amount is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Reference to the user who added the loan
    required: true,
  },
});

// Create a unique index on worker and loanDate
LoanSchema.index({ worker: 1, loanDate: 1 }, { unique: true });

const loanModel = mongoose.model("Loan", LoanSchema);

module.exports = loanModel;
