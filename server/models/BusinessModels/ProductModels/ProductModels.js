const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  subcategory: {
    type: String,
    required: [true, "Category is required"],
  },
  roles: [
    {
      role: {
        type: String,
        required: [true, "Role is required"],
      },
      wages: {
        type: Number,
        required: [true, "Wages is required"],
      },
    },
  ],
  totalLabourCost: {
    type: Number,
    required: [true, "Total Labour Cost is required"],
  },
  images: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to the User
});

const productModel = mongoose.model("Products", productSchema);

module.exports = productModel;
