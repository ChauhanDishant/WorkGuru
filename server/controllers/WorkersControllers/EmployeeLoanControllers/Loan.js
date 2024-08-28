const loanModel = require("./../../../models/WorkersModels/LoanModels/LoanModels");

const addLoan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { workerId, loanDate, loanAmount, repaidAmount } = req.body;

    if (!userId || !workerId || !loanDate || !loanAmount) {
      return res.status(400).send({
        message: "Required fields are missing",
        success: false,
      });
    }

    // Ensure consistent date format
    const formattedLoanDate = new Date(loanDate);
    formattedLoanDate.setHours(0, 0, 0, 0);

    // Check if a loan already exists for this worker on the same date
    const existingLoanDue = await loanModel.findOne({
      worker: workerId,
      loanDate: formattedLoanDate,
    });

    if (existingLoanDue) {
      return res.status(400).send({
        message: "Loan already exists for this worker on this date",
        success: false,
      });
    }

    // Create a new loan
    const newLoan = new loanModel({
      user: userId,
      worker: workerId,
      loanDate: formattedLoanDate,
      loanAmount,
      repaidAmount: repaidAmount || 0,
      totalAmount: loanAmount,
    });

    await newLoan.save();

    return res.status(200).send({
      message: "Loan Added Successfully",
      success: true,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({
        message:
          "Duplicate loan entry detected. Worker has already taken the loan on the same day",
        success: false,
      });
    }

    console.error(`Error adding loan: ${err.message}`);
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

    // Fetch loans for the current user and populate worker details
    const loanData = await loanModel
      .find({ user: userId })
      .populate("worker", "name phonenumber worktype gender") // Populate worker details
      .sort({ loanDate: -1 }); // Sort by loanDate or other fields if needed

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
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const loanId = req.params.loanId;
    const { repaidAmount } = req.body;

    if (!loanId || typeof repaidAmount !== "number" || repaidAmount <= 0) {
      return res.status(400).json({
        message: "Invalid request, repaidAmount must be a positive number",
        success: false,
      });
    }

    // Find the loan by loanId
    const loan = await loanModel.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
        success: false,
      });
    }

    // Calculate the updated amounts
    const updatedRepaidAmount = loan.repaidAmount + repaidAmount;
    const updatedTotalAmount = loan.loanAmount - updatedRepaidAmount;

    // Ensure the updated total amount doesn't go negative
    if (updatedTotalAmount < 0) {
      return res.status(400).json({
        message: `Repayment exceeds the total loan amount. Maximum allowable repayment is ${
          loan.loanAmount - loan.repaidAmount
        }`,
        success: false,
      });
    }

    // Update the loan
    loan.repaidAmount = updatedRepaidAmount;
    loan.totalAmount = updatedTotalAmount;

    // Save the updated loan
    await loan.save();

    return res.status(200).json({
      success: true,
      message: "Loan updated successfully",
      data: {
        repaidAmount: loan.repaidAmount,
        totalAmount: loan.totalAmount,
      },
    });
  } catch (err) {
    console.error(`Server Error: ${err.message}`);
    return res.status(500).json({
      message: "Server error occurred while updating loan",
      success: false,
    });
  }
};

module.exports = { addLoan, getLoan, editLoan };
