const express = require("express");
const router = express.Router();
const {
  addStocks,
  getStocks,
  editStocks,
  deleteStocks,
} = require("./../../../controllers/BusinessControllers/StockControllers/Stock.js");
const authMiddleware = require("./../../../middlewares/authMiddleware.js");

// ADD || POST routes
router.post("/addstocks", authMiddleware, addStocks);

// Fetch || GET routes
router.get("/listofstocks", authMiddleware, getStocks);

// Edit || Edit routes
router.put("/editstocks/:stockId", authMiddleware, editStocks);

// Delete || Delete routes
router.delete("/deletestocks/:stockId", authMiddleware, deleteStocks);

module.exports = router;
