const stockModel = require("./../../../models/BusinessModels/StockModels/StockModels.js");

// Add the stock data to the database
const addStocks = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(201)
        .send({ message: "User not Found", success: false });
    }

    const existingProduct = await stockModel.findOne({
      productname: req.body.productname,
    });
    if (existingProduct) {
      return res
        .status(409)
        .send({ message: "Product is already added", success: false });
    }
    const { productname, quantity, itemsperset, totalQuantity } = req.body;
    console.log(req.body);
    const stock = new stockModel({
      productname: productname,
      quantity: quantity,
      itemsperset: itemsperset,
      totalQuantity: totalQuantity,
      user: userId,
    });
    await stock.save();
    res
      .status(201)
      .send({ message: "Stock Added Successfully", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error in adding the stocks", success: true });
  }
};

// get the stocks data from the database
const getStocks = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(404)
        .send({ message: "User not Found", success: false });
    }

    // Ensure the find operation is awaited
    const stockData = await stockModel
      .find({ user: userId })
      .sort({ totalQuantity: 1 })
      .exec(); // Ensure to use exec() to return a promise

    console.log(stockData);
    res.status(200).send({
      message: "Stock data retrieved successfully",
      success: true,
      data: stockData,
    });
  } catch (err) {
    console.error("Error in retrieving stock data:", err);
    res
      .status(500)
      .send({ message: "Error in sending the data", success: false });
  }
};

// edit the stocks data in the database
const editStocks = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(404)
        .send({ message: "User not Found", success: false });
    }

    const stockId = req.params.stockId;
    const { productname, quantity, itemsperset } = req.body;
    const totalQuantity = parseInt(quantity);

    if (
      !stockId ||
      !productname ||
      !quantity ||
      !itemsperset ||
      isNaN(totalQuantity)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ProductName, Quantity, Items per Set, and Total Quantity are required",
      });
    }

    const updatedStocks = await stockModel.findByIdAndUpdate(
      stockId,
      { productname, quantity, itemsperset, totalQuantity },
      { new: true }
    );

    if (!updatedStocks) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock Data updated successfully",
      data: updatedStocks,
    });
  } catch (error) {
    console.error("Error updating Stock data:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// delete the stocks from the database
const deleteStocks = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    const stockId = req.params.stockId;
    console.log(req.params.stockId);
    if (!stockId) {
      return res.status(400).send({
        message: "Stock ID not provided",
        success: false,
      });
    }

    // Assuming you have a Role model to interact with the database
    const stock = await stockModel.findById(stockId);
    if (!stock) {
      return res.status(404).send({
        message: "Stock not found",
        success: false,
      });
    }

    await stockModel.findByIdAndDelete(stockId);

    return res.status(200).send({
      message: "Role deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error deleting role",
      success: false,
    });
  }
};

module.exports = { addStocks, getStocks, editStocks, deleteStocks };
