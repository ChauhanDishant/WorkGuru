const express = require("express");
const router = express.Router();

const {
  addLoan,
  getLoan,
  editLoan,
} = require("./../../../controllers/WorkersControllers/EmployeeLoanControllers/Loan");
const authMiddleware = require("./../../../middlewares/authMiddleware");

// POST || Add the Loan Method
router.post("/addloan", authMiddleware, addLoan);

// GET || Fetch the Loan Method
router.get("/listofloans", authMiddleware, getLoan);

// PUT || Edit the Loan Amount
router.put("/editloan/:loanId", authMiddleware, editLoan);
module.exports = router;
