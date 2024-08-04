const express = require("express");
const router = express.Router();
const {
  addRetailers,
  getRetailers,
  editRetailers,
  deleteRetailers,
} = require("./../../../controllers/BusinessControllers/RetailerControllers/Retailer.js");
const authMiddleware = require("./../../../middlewares/authMiddleware.js");

// ADD || POST routes
router.post("/addretailers", authMiddleware, addRetailers);

// FETCH || GET routes
router.get("/listofretailers", authMiddleware, getRetailers);

// EDIT || EDIT routes
router.put("/editretailers/:retailersId", authMiddleware, editRetailers);

// DELETE || DELETE routes
router.delete("/deleteretailers/:retailersId", authMiddleware, deleteRetailers);

module.exports = router;
