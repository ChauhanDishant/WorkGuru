const productModel = require("./../../../models/BusinessModels/ProductModels/ProductModels");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Set file size limit (optional)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("images", 10); // Accept multiple files with field name 'images'

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Add the Products
const addProducts = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .send({ message: "Error uploading files", success: false });
    } else if (err) {
      return res.status(500).send({ message: "Unknown error", success: false });
    }

    try {
      const userId = req.user._id;
      if (!userId) {
        return res
          .status(400)
          .send({ message: "User not found", success: false });
      }

      // Check if product with the same name already exists
      const existingProduct = await productModel.findOne({
        name: req.body.name,
      });
      if (existingProduct) {
        return res
          .status(400)
          .send({ message: "Product name already taken", success: false });
      }

      // Get file paths of uploaded images
      const imagePaths = req.files.map((file) => file.path);

      // Parse roles safely
      let roles = [];
      if (req.body.roles) {
        try {
          roles = JSON.parse(req.body.roles);
        } catch (parseError) {
          return res
            .status(400)
            .send({ message: "Invalid roles data", success: false });
        }
      }

      // Create a new product
      const product = new productModel({
        name: req.body.name,
        category: req.body.category,
        subcategory: req.body.subcategory,
        roles,
        totalLabourCost: req.body.totalLabourCost,
        images: imagePaths,
        user: userId,
      });

      // Save the product to the database
      await product.save();
      res
        .status(201)
        .send({ message: "Product added successfully", success: true });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Error adding product data", success: false });
    }
  });
};

// Get the Products

// Get the Products
const getProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).send({ message: "Invalid User", success: false });
    }

    const products = await productModel
      .find({ user: userId })
      .sort({ name: 1 });

    res.status(200).send({
      message: "Products retrieved successfully",
      success: true,
      data: products,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error fetching the products", success: false });
    console.error(err);
  }
};

const deleteProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    if (!userId) {
      return res.status(400).send({ message: "Invalid User", success: false });
    }
      const product = await productModel.findById(productId);
      if (!product) {
        return res
          .status(404)
          .send({ message: "Product not found", success: false });
      }
    await productModel.findByIdAndDelete(productId);

    return res.status(200).send({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Unable to delete the data", success: false });
    console.log(err);
  }
};

const editproducts = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err, success: false });
    }

    try {
      const userId = req.user._id;
      if (!userId) {
        return res
          .status(400)
          .send({ message: "Invalid User", success: false });
      }

      const productId = req.params.productId;
      const { name, category, subcategory, totalLabourCost } = req.body;
      let roles = [];
      let images = [];

      // Parse roles if they exist
      if (req.body.roles) {
        roles = JSON.parse(req.body.roles);
      }

      // Handle images if they exist
      if (req.files) {
        images = req.files.map((file) => file.path);
      }

      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { name, category, subcategory, roles, totalLabourCost, images },
        { new: true }
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .send({ message: "Product not found", success: false });
      }

      res.status(200).send({
        message: "Product updated successfully",
        success: true,
        data: updatedProduct,
      });
    } catch (err) {
      console.error("Error in editproducts:", err);
      res
        .status(500)
        .send({ message: "Error updating product", success: false });
    }
  });
};

module.exports = { addProducts, getProducts, deleteProducts, editproducts };
