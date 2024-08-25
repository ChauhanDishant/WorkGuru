const loanModel = require("./../../../models/WorkersModels/LoanModels/LoanModels");

const addLoan = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    const {
      workername,
      loanDate,
      loanAmount,
      repaidAmount,
      totalAmount,
      phonenumber,
      gender,
      worktype,
    } = req.body;

    // Check if the loan already exists for this worker on the same date
    const existingLoanDue = await loanModel.findOne({ workername, loanDate });

    if (existingLoanDue) {
      return res.status(400).send({
        message: "Loan already given to this worker on this date",
        success: false,
      });
    }

    // Create a new loan
    const newLoan = new loanModel({
      user: userId,
      workername,
      loanDate,
      loanAmount,
      repaidAmount,
      totalAmount,
      phonenumber,
      gender,
      worktype,
    });

    await newLoan.save();

    return res.status(200).send({
      message: "Loan Added Successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error adding loan:", err.message);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getLoan = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    // Fetch loans for the current user
    const loanData = await loanModel
      .find({ user: userId })
      .sort({ workername: 1 });

    return res.status(200).send({
      message: "Loan Data Fetched Successfully",
      success: true,
      data: loanData,
    });
  } catch (err) {
    console.error(`Error fetching loan data: ${err.message}`);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const editLoan = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    const loanId = req.params.loanId;
    const { repaidAmount } = req.body;

    if (!loanId || typeof repaidAmount !== "number") {
      return res.status(400).send({
        message: "Invalid request",
        success: false,
      });
    }

    // Find and update the loan
    const loan = await loanModel.findById(loanId);
    if (!loan) {
      return res.status(404).send({
        message: "Loan not found",
        success: false,
      });
    }

    // Calculate the new repaid amount and total amount
    const updatedRepaidAmount = loan.repaidAmount + repaidAmount;
    const updatedTotalAmount = loan.loanAmount - updatedRepaidAmount;

    // Ensure that the total amount does not go negative
    if (updatedTotalAmount < 0) {
      return res.status(400).send({
        message: "Repayment exceeds the total loan amount",
        success: false,
      });
    }

    // Update loan
    loan.repaidAmount = updatedRepaidAmount;
    loan.totalAmount = updatedTotalAmount;
    await loan.save();

    res.status(200).send({
      success: true,
      message: "Loan updated successfully",
      data: {
        repaidAmount: loan.repaidAmount,
        totalAmount: loan.totalAmount,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = { addLoan, getLoan, editLoan };
