const express = require("express");
const router = express.Router();

const {
  addProducts,
  getProducts,
  editproducts,
  deleteProducts,
} = require("./../../../controllers/BusinessControllers/ProductControllers/Product");

const authMiddleware = require("./../../../middlewares/authMiddleware");

// POST || Add products to your database.
router.post("/addproducts", authMiddleware, addProducts);

// GET || Remove products from your database.
router.get("/listofproducts", authMiddleware, getProducts);

// PUT || Edit the products into the databse
router.put("/updateproduct/:productId", authMiddleware, editproducts);

// DELETE || remove products from your database.
router.delete("/deleteproducts/:productId", authMiddleware, deleteProducts);
module.exports = router;
