const invoiceModel = require("./../../../models/BusinessModels/InvoiceModels/InvoiceModels.js");

// Add the invoice data into the database.
const addInvoices = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerName,
      customerContact,
      shippingAddress,
      invoiceDate,
      terms,
      paymentStatus,
      items,
      discount,
      sgst,
      cgst,
      igst,
      totalAmount,
    } = req.body;

    // Extract user ID from token or request (example for JWT)
    const userId = req.user._id; // This depends on how you manage user authentication

    // Ensure all required fields are present
    if (!userId) {
      return res
        .status(400)
        .send({ message: "User is required", success: false });
    }

    const newInvoice = new invoiceModel({
      invoiceNumber,
      customerName,
      customerContact,
      shippingAddress,
      invoiceDate,
      terms,
      paymentStatus,
      items,
      discount,
      sgst,
      cgst,
      igst,
      totalAmount,
      user: userId,
    });

    await newInvoice.save();
    res.status(201).send({
      message: "Invoice Added Successfully",
      success: true,
      data: newInvoice,
    });
  } catch (error) {
    console.log("Error adding invoice:", error);
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

const getInvoices = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(409)
        .send({ message: "User not found", success: false });
    }
    const invoices = await invoiceModel
      .find({ user: userId })
      .sort({ invoiceNumber: 1 });
    res.status(200).send({
      message: "Invoice Fetched Successfully",
      success: true,
      data: invoices,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error in fetching the invoices", success: false });
    console.log(err);
  }
};

// Getting the lastest invoice number
const getNextInvoiceNumber = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(409)
        .send({ message: "User not found", success: false });
    }

    // Find the maximum invoice number for the user
    const maxInvoice = await invoiceModel
      .findOne({ user: userId })
      .sort({ invoiceNumber: -1 })
      .limit(1);

    let nextInvoiceNumber;

    if (maxInvoice) {
      // Extract the numeric part, increment it, and format it back
      const currentNumber = parseInt(
        maxInvoice.invoiceNumber.replace("INV-", "")
      );
      nextInvoiceNumber =
        "INV-" + (currentNumber + 1).toString().padStart(4, "0");
    } else {
      // If no existing invoice, start with INV-0101
      nextInvoiceNumber = "INV-0101";
    }

    res.status(200).send({
      message: "Next invoice number retrieved successfully",
      success: true,
      nextInvoiceNumber: nextInvoiceNumber,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error in getting next invoice number",
      success: false,
    });
    console.log(err);
  }
};

module.exports = { addInvoices, getInvoices, getNextInvoiceNumber };
