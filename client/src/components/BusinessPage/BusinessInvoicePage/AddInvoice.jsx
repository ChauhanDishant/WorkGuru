import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const AddInvoice = () => {
  const navigate = useNavigate();

  const [retailersName, setRetailersName] = useState("");
  const [retailersAddress, setRetailersAddress] = useState("");
  const [retailersContact, setRetailersContact] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [terms, setTerms] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [retailerInputs, setRetailerInputs] = useState([
    {
      itemName: "",
      itemDescription: "",
      quantity: 0,
      rate: 0,
      amount: 0,
    },
  ]);
  const [subtotalAmount, setSubTotalAmount] = useState(0.0);
  const [discount, setDiscount] = useState(0);
  const [sgst, setSGST] = useState(0.0);
  const [cgst, setCGST] = useState(0.0);
  const [igst, setIGST] = useState(0.0);
  const [totalAmount, setTotalAmount] = useState(0.0);

  const [retailers, setRetailers] = useState([]);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:5000/";

    const fetchRetailers = async () => {
      try {
        const res = await axios.get("/workguru/business/listofretailers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setRetailers(res.data.data);
          toast.success(res.data.message);
        }
      } catch (err) {
        toast.error("Failed to get the retailers");
        console.log(err);
      }
    };
    fetchRetailers();

    const fetchStocks = async () => {
      try {
        const res = await axios.get("/workguru/business/listofstocks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setStocks(res.data.data);
          toast.success("Stocks quantity fetched successfully");
        }
      } catch (error) {
        toast.error("Error fetching stocks quantity");
        console.error("Error fetching stocks quantity:", error);
      }
    };
    fetchStocks();
  }, []);

  const handleRetailerChange = (event) => {
    const selectedName = event.target.value;
    setRetailersName(selectedName);

    const selectedRetailer = retailers.find(
      (retailer) => retailer.storename === selectedName
    );

    if (selectedRetailer) {
      setRetailersAddress(selectedRetailer.contactaddress);
      setRetailersContact(selectedRetailer.contactnumber);
    } else {
      setRetailersAddress("");
      setRetailersContact("");
    }
  };

  const handleItemNameChange = (index, value) => {
    const isItemAlreadySelected = retailerInputs.some(
      (input, i) => i !== index && input.itemName === value
    );

    if (isItemAlreadySelected) {
      toast.error("This item is already selected");
      return;
    }

    const updatedRetailerInputs = [...retailerInputs];
    updatedRetailerInputs[index].itemName = value;
    setRetailerInputs(updatedRetailerInputs);
  };

  const handleItemDescriptionChange = (index, value) => {
    const updatedRetailerInputs = [...retailerInputs];
    updatedRetailerInputs[index].itemDescription = value;
    setRetailerInputs(updatedRetailerInputs);
  };

  const handleQuantityChange = (index, value) => {
    const quantityValue = parseFloat(value); // Ensure value is a number

    const updatedRetailerInputs = [...retailerInputs];
    const selectedProduct = updatedRetailerInputs[index].itemName;
    const selectedStock = stocks.find(
      (stock) => stock.productname === selectedProduct
    );

    if (selectedStock) {
      if (quantityValue > selectedStock.totalQuantity) {
        toast.error(
          `The selected quantity for ${selectedProduct} exceeds the available stock quantity ${selectedStock.totalQuantity}`
        );
        return; // Prevent further updates
      }

      updatedRetailerInputs[index].quantity = quantityValue;
      updatedRetailerInputs[index].amount =
        quantityValue * updatedRetailerInputs[index].rate;
      setRetailerInputs(updatedRetailerInputs);
    }
  };

  const handleRateChange = (index, value) => {
    const updatedRetailerInputs = [...retailerInputs];
    updatedRetailerInputs[index].rate = value;
    updatedRetailerInputs[index].amount =
      updatedRetailerInputs[index].quantity * value;
    setRetailerInputs(updatedRetailerInputs);
  };

  useEffect(() => {
    const subtotalAmount = retailerInputs.reduce((acc, current) => {
      return acc + current.amount;
    }, 0);
    setSubTotalAmount(subtotalAmount);
  }, [retailerInputs]);

  useEffect(() => {
    const discountValue = parseFloat(discount) || 0.0;
    const sgstValue = parseFloat(sgst) || 0.0;
    const cgstValue = parseFloat(cgst) || 0.0;
    const igstValue = parseFloat(igst) || 0.0;

    const finalAmount =
      subtotalAmount -
      discountValue +
      (sgstValue / 100) * subtotalAmount +
      (cgstValue / 100) * subtotalAmount +
      (igstValue / 100) * subtotalAmount;

    if (finalAmount < 0) {
      toast.error("Amount cannot be negative");
      return;
    }

    setTotalAmount(finalAmount.toFixed(2));
  }, [subtotalAmount, discount, sgst, cgst, igst]);

  const addRetailerInput = () => {
    const newRetailerInputs = [
      ...retailerInputs,
      {
        itemName: "",
        itemDescription: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ];
    setRetailerInputs(newRetailerInputs);
  };

  const deleteRetailerInput = (index) => {
    const updatedRetailerInputs = [...retailerInputs];
    updatedRetailerInputs.splice(index, 1);
    setRetailerInputs(updatedRetailerInputs);
  };

  const isLastRetailerInputValid = () => {
    const lastRetailerInput = retailerInputs[retailerInputs.length - 1];
    return (
      lastRetailerInput.itemName !== "" &&
      lastRetailerInput.itemDescription !== "" &&
      lastRetailerInput.quantity !== 0 &&
      lastRetailerInput.rate !== 0 &&
      lastRetailerInput.amount !== 0
    );
  };

  const isFormValid = () => {
    return (
      retailersName &&
      retailersAddress &&
      retailersContact &&
      shippingAddress &&
      invoiceDate &&
      terms &&
      paymentStatus &&
      retailerInputs.every(
        (input) =>
          input.itemName &&
          input.itemDescription &&
          input.quantity > 0 &&
          input.rate > 0 &&
          input.amount >= 0
      ) &&
      subtotalAmount >= 0 &&
      cgst >= 0 &&
      sgst >= 0 &&
      igst >= 0 &&
      totalAmount >= 0
    );
  };

  // Getting the New Invoice Number
  useEffect(() => {
    const FetchingNextInvoiceNumber = async () => {
      axios.defaults.baseURL = "http://localhost:5000/";
      try {
        // First, get the next invoice number
        const res = await axios.get(
          "/workguru/business/get-next-invoice-number",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          const nextInvoiceNumber = res.data.nextInvoiceNumber;
          setInvoiceNumber(nextInvoiceNumber);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error("Error getting next invoice number");
      }
    };

    FetchingNextInvoiceNumber();
  });

  // Updating the Stock Data
  const updateStock = async () => {
    const updatedStocks = retailerInputs
      .map((input) => {
        const selectedStock = stocks.find(
          (stock) => stock.productname === input.itemName
        );

        if (selectedStock) {
          const updatedQuantity = selectedStock.quantity - input.quantity;
          const updatedTotalQuantity = updatedQuantity;

          return {
            _id: selectedStock._id, // Assuming each stock has a unique ID
            productname: selectedStock.productname,
            quantity: updatedQuantity,
            itemsperset: selectedStock.itemsperset,
            totalQuantity: updatedTotalQuantity,
          };
        }

        return null;
      })
      .filter((stock) => stock !== null);

    try {
      console.log("Updated stocks:", updatedStocks);

      await Promise.all(
        updatedStocks.map((stock) => {
          const payload = {
            productname: stock.productname,
            quantity: stock.quantity,
            itemsperset: stock.itemsperset,
            totalQuantity: stock.totalQuantity,
          };

          console.log(
            `Sending data for stock ID ${stock._id}:`,
            JSON.stringify(payload)
          );

          return axios.put(
            `/workguru/business/editstocks/${stock._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        })
      )
        .then(function () {
          toast.success("Stock is updated");
        })
        .catch(function (error) {
          console.error(
            "Error updating stocks:",
            error.response ? error.response.data : error.message
          );
          toast.error("Cannot update the function");
        });
    } catch (error) {
      console.error(
        "Error updating stocks:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update stocks");
    }
  };

  // HandleSubmit Method
  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = {
      invoiceNumber,
      customerName: retailersName,
      customerContact: retailersContact,
      shippingAddress,
      invoiceDate,
      terms,
      paymentStatus,
      items: retailerInputs,
      discount,
      sgst,
      cgst,
      igst,
      totalAmount,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/workguru/business/addinvoices",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        await updateStock(); // Update stock after invoice submission
        toast.success("Invoice added");
        setTimeout(() => {
          navigate("/business/listofinvoices");
        }, 2000);
      } else {
        toast.error("Failed to add invoice");
      }
    } catch (error) {
      console.error("Failed to add invoice:", error);
      toast.error("An error occurred while adding the invoice");
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Invoice</title>
      </Helmet>
      <BusinessSideBarPage>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Add Invoice</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retailer's Name
                  </label>
                  <select
                    value={retailersName}
                    onChange={handleRetailerChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Retailer</option>
                    {retailers.map((retailer) => (
                      <option key={retailer._id} value={retailer.storename}>
                        {retailer.storename}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retailer's Address
                  </label>
                  <input
                    type="text"
                    value={retailersAddress}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retailer's Contact
                  </label>
                  <input
                    type="text"
                    value={retailersContact}
                    onChange={(e) => setRetailersContact(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Set min to today's date
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Terms
                  </label>
                  <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    onChange={(e) => {
                      setPaymentStatus(e.target.value);
                    }}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="complete">Complete</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    readOnly
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {retailerInputs.map((input, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Item Name
                        </label>
                        <select
                          value={input.itemName}
                          onChange={(e) =>
                            handleItemNameChange(index, e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Item</option>
                          {stocks.map((stock) => (
                            <option key={stock._id} value={stock.productname}>
                              {stock.productname}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Item Description
                        </label>
                        <input
                          type="text"
                          value={input.itemDescription}
                          onChange={(e) =>
                            handleItemDescriptionChange(index, e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={input.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rate
                        </label>
                        <input
                          type="number"
                          value={input.rate}
                          onChange={(e) =>
                            handleRateChange(index, e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={input.amount}
                          readOnly
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      {index === retailerInputs.length - 1 && (
                        <button
                          type="button"
                          onClick={addRetailerInput}
                          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          disabled={!isLastRetailerInputValid()}
                        >
                          Add Item
                        </button>
                      )}
                      {retailerInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteRetailerInput(index)}
                          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Subtotal Amount
                </label>
                <input
                  type="number"
                  value={subtotalAmount}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CGST(%)
                  </label>
                  <input
                    type="number"
                    value={cgst}
                    onChange={(e) => setCGST(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SGST(%)
                  </label>
                  <input
                    type="number"
                    value={sgst}
                    onChange={(e) => setSGST(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IGST(%)
                  </label>
                  <input
                    type="number"
                    value={igst}
                    onChange={(e) => setIGST(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={totalAmount}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-green-500 font-medium"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  disabled={!isFormValid()}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </BusinessSideBarPage>
    </>
  );
};

export default AddInvoice;
