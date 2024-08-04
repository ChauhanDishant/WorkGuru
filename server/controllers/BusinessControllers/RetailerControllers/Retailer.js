const retailerModel = require("./../../../models/BusinessModels/RetailerModels/RetailerModels");

// POST method
const addRetailers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "User is Unauthorized", sucess: fale });
    }

    const existingRetailer = await retailerModel.findOne({
      contactemail: req.body.contactemail,
    });

    if (existingRetailer) {
      res
        .status(201)
        .send({ message: "Retailer already exists", success: false });
    }
    const {
      storename,
      firstname,
      lastname,
      contactnumber,
      contactemail,
      contactaddress,
      selectedState,
      district,
      postalcode,
    } = req.body;

    const retailers = new retailerModel({
      storename,
      firstname,
      lastname,
      contactnumber,
      contactemail,
      contactaddress,
      selectedState,
      district,
      postalcode,
      user: userId,
    });

    await retailers.save();
    res
      .status(201)
      .send({ message: "Retailers added Successfully", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error in adding Retailers", success: false });
  }
};

// GET Method
const getRetailers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(401)
        .send({ message: "User is Unauthorized", sucess: fale });
    }

    const retailers = await retailerModel
      .find({ user: userId })
      .sort({ storename: 1 });
    console.log(retailers, userId);
    res.status(200).json({
      message: "Retailers Data retrieved Successfully",
      success: true,
      data: retailers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Retrieving the Retailers Data",
      success: false,
    });
  }
};

// PUT METHOD
const editRetailers = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in req.user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const retailerId = req.params.retailersId; // Extract Role ID from request parameters
    const {
      storename,
      firstname,
      lastname,
      contactnumber,
      contactemail,
      contactaddress,
    } = req.body; // Extract updated role data from request body

    // Validate input
    if (
      !retailerId ||
      !storename ||
      !firstname ||
      !lastname ||
      !contactnumber ||
      !contactemail ||
      !contactaddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Details are missing!",
      });
    }

    // Find the role by ID and update it
    const updateRetailer = await retailerModel.findByIdAndUpdate(
      retailerId,
      {
        storename,
        firstname,
        lastname,
        contactnumber,
        contactemail,
        contactaddress,
      },
      { new: true } // Return the updated document
    );
    // Check if the role was found and updated
    if (!updateRetailer) {
      return res.status(404).json({
        success: false,
        message: "Retailer not found",
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Retailer updated successfully",
      data: updateRetailer,
    });
  } catch (error) {
    console.error("Error updating Retailer:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE METHOD
const deleteRetailers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    const retailerId = req.params.retailersId;
    console.log(req.params.retailerId);
    if (!retailerId) {
      return res.status(400).send({
        message: "Retailer ID not provided",
        success: false,
      });
    }

    // Assuming you have a Retailer model to interact with the database
    const role = await retailerModel.findById(retailerId);
    if (!retailerId) {
      return res.status(404).send({
        message: "Retailer not found",
        success: false,
      });
    }

    await retailerModel.findByIdAndDelete(retailerId);

    return res.status(200).send({
      message: "Retailer deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error deleting Retailer",
      success: false,
    });
  }
};

module.exports = { addRetailers, getRetailers, editRetailers, deleteRetailers };
