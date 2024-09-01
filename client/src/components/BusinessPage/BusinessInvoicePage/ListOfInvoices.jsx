import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import InvoicePDF from "./InvoicePDF";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const ListofInvoices = () => {
  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState([]);
  const [user, setUser] = useState([]);
  const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);
  const [sortOption, setSortOption] = useState("Recent");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://workguru-server.onrender.com"
        : "http://localhost:5000/";

    const fetchInvoices = async () => {
      try {
        const res = await axios.get("/workguru/business/listofinvoices", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setInvoiceData(res.data.data);
          setFilteredInvoiceData(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
        toast.error(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/workguru/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          console.log(response.data.data);
          toast.success(response.data.message);
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
        toast.error(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatAmountIndian = (amount) => {
    const amountParts = amount.toFixed(2).split(".");
    let integerPart = amountParts[0];
    const decimalPart = amountParts[1];

    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    if (otherDigits !== "") {
      integerPart =
        otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        lastThreeDigits;
    }

    return integerPart + "." + decimalPart + " /-";
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedData = [...invoiceData];

    switch (option) {
      case "Recent":
        sortedData.sort(
          (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
        );
        break;
      case "Invoice Number":
        sortedData.sort((a, b) =>
          a.invoiceNumber.localeCompare(b.invoiceNumber)
        );
        break;
      case "Customer Name":
        sortedData.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case "Date (Newest)":
        sortedData.sort(
          (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
        );
        break;
      case "Date (Oldest)":
        sortedData.sort(
          (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate)
        );
        break;
      case "Amount (Highest)":
        sortedData.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "Amount (Lowest)":
        sortedData.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "Payment Status":
        sortedData.sort((a, b) =>
          a.paymentStatus.localeCompare(b.paymentStatus)
        );
        break;
      case "Last 10 Days":
        const now = new Date();
        const tenDaysAgo = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 9,
          0,
          0,
          0,
          0
        );
        sortedData = sortedData.filter((invoice) => {
          const invoiceDate = new Date(invoice.invoiceDate);
          return invoiceDate >= tenDaysAgo && invoiceDate <= now;
        });
        sortedData.sort(
          (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
        );
        break;
      case "Last Month":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        lastMonth.setDate(1); // Set to the first day of the previous month
        const thisMonth = new Date();
        thisMonth.setDate(1); // Set to the first day of the current month
        sortedData = sortedData.filter(
          (invoice) =>
            new Date(invoice.invoiceDate) >= lastMonth &&
            new Date(invoice.invoiceDate) < thisMonth
        );
        break;

      case "Last Year":
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        lastYear.setMonth(0, 1); // Set to January 1st of the previous year
        const thisYear = new Date();
        thisYear.setMonth(0, 1); // Set to January 1st of the current year
        sortedData = sortedData.filter(
          (invoice) =>
            new Date(invoice.invoiceDate) >= lastYear &&
            new Date(invoice.invoiceDate) < thisYear
        );
        break;
      default:
        break;
    }

    setFilteredInvoiceData(sortedData);
  };

  // ------------------- Method for editing the Invoice Payment Status
  const [editable, setEditable] = useState(false);
  const [editInvoice, setEditInvoice] = useState([]);
  const [editInvoiceNumber, setEditInvoiceNumber] = useState("");
  const [editRetailersName, setEditRetailersName] = useState("");
  const [editInvoiceDate, setEditInvoiceDate] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editTotalAmount, setEditTotalAmount] = useState("");

  // Edit Button for setting it
  const handleEditable = (invoice) => {
    setEditable(true);
    setEditInvoice(invoice);
    setEditInvoiceNumber(invoice.invoiceNumber || "");
    setEditRetailersName(invoice.customerName || "");
    setEditInvoiceDate(invoice.invoiceDate || "");
    setEditPaymentStatus(invoice.paymentStatus || "");
    setEditTotalAmount(invoice.totalAmount || "");
  };

  const handleEditSubmit = async (e) => {
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://workguru-server.onrender.com"
        : "http://localhost:5000/";
    e.preventDefault();
    try {
      if (!editInvoice) {
        toast.error("No invoice selected for editing");
        return;
      }

      const updatedData = {
        invoiceNumber: editInvoiceNumber,
        customerName: editRetailersName,
        customerContact: editInvoice.customerContact || "",
        shippingAddress: editInvoice.shippingAddress || "",
        invoiceDate: editInvoiceDate,
        terms: editInvoice.terms || "",
        items: editInvoice.items || [],
        paymentStatus: editPaymentStatus,
        discount: editInvoice.discount || 0,
        sgst: editInvoice.sgst || 0,
        cgst: editInvoice.cgst || 0,
        igst: editInvoice.igst || 0,
        totalAmount: editTotalAmount,
      };

      console.log(updatedData);
      console.log(editInvoice._id);

      const res = await axios.put(
        `/workguru/business/editinvoices/${editInvoice._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data && res.data.success) {
        toast.success(res.data.message);

        // Update the invoice data in the state
        setInvoiceData((prevData) =>
          prevData.map((invoice) =>
            invoice._id === editInvoice._id
              ? { ...invoice, ...updatedData }
              : invoice
          )
        );

        setEditInvoice(null);
        setEditable(false);
        window.location.reload();
      } else {
        toast.error(res.data?.message || "Failed to update invoice");
      }
    } catch (error) {
      toast.error(
        `Error updating Invoice: ${
          error.response?.data?.message || "Server error"
        }`
      );
      console.error("Error updating Invoice:", error);
    }
  };

  // Pagination for it
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust this number as needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoiceData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>Invoices Section</title>
        </Helmet>
        {editable ? (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">
              Edit Invoice
            </h2>
            <form
              onSubmit={handleEditSubmit}
              className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border-2 border-blue-200"
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <p className="block py-2 px-3 text-lg text-blue-800 font-semibold bg-blue-100 rounded">
                  {editInvoiceNumber}
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retailers Name
                </label>
                <p className="block py-2 px-3 text-lg text-blue-800 font-semibold bg-blue-100 rounded">
                  {editRetailersName}
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date
                </label>
                <p className="block py-2 px-3 text-lg text-blue-800 font-semibold bg-blue-100 rounded">
                  {formatDate(editInvoiceDate)}
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="block w-full px-4 py-2 text-gray-800 bg-yellow-100 border border-yellow-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <p className="block py-2 px-3 text-lg text-blue-800 font-semibold bg-blue-100 rounded">
                  ₹ {formatAmountIndian(editTotalAmount)}
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditable(false);
                    setEditInvoice(null);
                    setEditInvoiceNumber("");
                    setEditRetailersName("");
                    setEditInvoiceDate("");
                    setEditPaymentStatus("");
                    setEditTotalAmount("");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="bg-gray-100 min-h-screen p-8">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Invoices
                </h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Latest Payments
                    </h2>
                    <div className="flex items-center space-x-4">
                      <select
                        className="bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => handleSort(e.target.value)}
                      >
                        <option value="">Select Option</option>
                        <option value="Recent">Recent</option>
                        <option value="Invoice Number">Invoice Number</option>
                        <option value="Customer Name">Customer Name</option>
                        <option value="Date (Newest)">Date (Newest)</option>
                        <option value="Date (Oldest)">Date (Oldest)</option>
                        <option value="Amount (Highest)">
                          Amount (Highest)
                        </option>
                        <option value="Amount (Lowest)">Amount (Lowest)</option>
                        <option value="Payment Status">Payment Status</option>
                        <option value="Last 10 Days">Last 10 Days</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Last Year">Last Year</option>
                      </select>
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                        Export to CSV
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sr. No.
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice Number
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Details
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice Date
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Amount
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Status
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                          currentItems.map((invoice, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                                {(currentPage - 1) * itemsPerPage + (index + 1)}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                {invoice.invoiceNumber}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {invoice.customerName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {invoice.customerContact}
                                </div>
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(invoice.invoiceDate)}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                {formatAmountIndian(invoice.totalAmount)}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-md leading-5 font-semibold rounded-full ${
                                    invoice.paymentStatus === "complete"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {invoice.paymentStatus === "complete"
                                    ? "Complete"
                                    : "Pending"}
                                </span>
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                <PDFDownloadLink
                                  document={
                                    <InvoicePDF invoice={invoice} user={user} />
                                  }
                                  fileName={`${invoice.invoiceNumber}.pdf`}
                                >
                                  {({ blob, url, loading, error }) =>
                                    loading ? (
                                      "Loading document..."
                                    ) : (
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                        alt="PDF"
                                        className="w-7 h-7 cursor-pointer hover:opacity-75 transition duration-300"
                                      />
                                    )
                                  }
                                </PDFDownloadLink>
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => handleEditable(invoice)}
                                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors duration-200"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="py-4 px-6 text-center text-gray-500"
                            >
                              No matching data found for the selected filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="mt-4 flex justify-center">
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        {Array.from({
                          length: Math.ceil(
                            filteredInvoiceData.length / itemsPerPage
                          ),
                        }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === index + 1
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </BusinessSideBarPage>
    </>
  );
};

export default ListofInvoices;
