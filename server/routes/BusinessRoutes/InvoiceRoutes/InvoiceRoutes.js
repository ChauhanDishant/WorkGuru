const express = require("express");
const router = express.Router();

const {
  addInvoices,
  getInvoices,
  deleteInvoices,
  getNextInvoiceNumber,
} = require("./../../../controllers/BusinessControllers/InvoiceControllers/Invoice");

const authMiddleware = require("./../../../middlewares/authMiddleware");

// ADD || POST Routes
router.post("/addinvoices", authMiddleware, addInvoices);

// FETCH || GET Routes
router.get("/listofinvoices", authMiddleware, getInvoices);

// GET || GETTING Lastest Routes
router.get("/get-next-invoice-number", authMiddleware, getNextInvoiceNumber);

module.exports = router;
