const mongoose = require("mongoose");

const stocksSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: [true, "Name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  itemsperset: {
    type: Number,
    required: [true, "ItemsPerSet is required"],
  },
  totalQuantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // Reference to the User
});

const stockModel = mongoose.model("Stocks", stocksSchema);

module.exports = stockModel;
