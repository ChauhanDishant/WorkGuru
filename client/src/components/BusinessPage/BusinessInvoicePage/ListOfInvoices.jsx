import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import InvoicePDF from "./InvoicePDF";
import Invoice from "./InvoicePDF";

const ListofInvoices = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);
  const [sortOption, setSortOption] = useState("Recent");

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:5000/";
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
        toast.error(err.message);
      }
    };
    fetchInvoices();
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

  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>Invoices Section</title>
        </Helmet>
        <div className="bg-gray-100 min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoices</h1>
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
                    <option value="Amount (Highest)">Amount (Highest)</option>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoiceData.length > 0 ? (
                      filteredInvoiceData.map((invoice, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
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
                              document={<InvoicePDF invoice={invoice} />}
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
              </div>
            </div>
          </div>
        </div>
      </BusinessSideBarPage>
    </>
  );
};

export default ListofInvoices;
