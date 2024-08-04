const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, "Invoice Number is required"],
  },
  customerName: {
    type: String,
    required: [true, "Customer Name is required"],
  },
  customerContact: {
    type: String,
    required: [true, "Customer Contact is required"],
  },
  shippingAddress: {
    type: String,
    required: [true, "Shipping Address is required"],
  },
  invoiceDate: {
    type: Date,
    required: [true, "Invoice Date is required"],
  },
  terms: {
    type: String,
    required: [true, "Terms is required"],
  },
  paymentStatus: {
    type: String,
    required: [true, "Payment Status is required"],
  },
  items: [
    {
      itemName: {
        type: String,
        required: [true, "Item Name is required"],
      },
      itemDescription: {
        type: String,
        required: [true, "Item Description is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      rate: {
        type: Number,
        required: [true, "Rate is required"],
      },
      amount: {
        type: Number,
        required: [true, "Subtotal Amount is required"],
      },
    },
  ],
  discount: {
    // Corrected typo from dicount to discount
    type: Number,
    required: [true, "Discount is required"],
  },
  sgst: {
    type: Number,
    required: [true, "SGST is required"],
  },
  cgst: {
    type: Number,
    required: [true, "CGST is required"],
  },
  igst: {
    type: Number,
    required: [true, "IGST is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total Amount is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "User is required"],
  },
});

const invoiceModel = mongoose.model("Invoices", invoiceSchema);

module.exports = invoiceModel;
