import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

const LoanComponents = ({ loan }) => {
  const [repayAmount, setRepayAmount] = useState("");
  const [loanData, setLoanData] = useState(loan);

  useEffect(() => {
    setLoanData(loan); // Update loan data when props change
  }, [loan]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleRepay = async () => {
    try {
      const repaymentAmount = parseFloat(repayAmount);

      if (isNaN(repaymentAmount) || repaymentAmount <= 0) {
        toast.error("Please enter a valid repayment amount.");
        return;
      }

      const remainingAmount = loanData.loanAmount - loanData.repaidAmount;

      if (repaymentAmount > remainingAmount) {
        toast.error(
          `Repay amount cannot exceed ${formatCurrency(remainingAmount)}.`
        );
        return;
      }

      // Construct the payload for repayment
      const payload = {
        repaidAmount: repaymentAmount, // Amount to be added to repaidAmount
      };

      // Send the request to the backend
      const response = await axios.put(
        `http://localhost:5000/workguru/workers/editloan/${loanData._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Check if the request was successful
      if (response.data.success) {
        toast.success(response.data.message);

        // Update local state with the new loan data
        setLoanData((prevState) => ({
          ...prevState,
          repaidAmount: prevState.repaidAmount + repaymentAmount,
          totalAmount:
            prevState.loanAmount - (prevState.repaidAmount + repaymentAmount),
        }));

        // Reset the repay amount field
        setRepayAmount("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err.message);

      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An error occurred while processing the repayment.");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Loan Report for {loanData.worker.name || "N/A"}
      </h2>
      <p>
        <strong>Phone Number:</strong> {loanData.worker.phonenumber}
      </p>
      <p>
        <strong>Gender:</strong> {loanData.worker.gender || "Not Known"}
      </p>
      <p>
        <strong>Work Type:</strong> {loanData.worker.worktype}
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Loan Details:</h3>
        <table className="min-w-full bg-white border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Loan Date</th>
              <th className="border p-2">Loan Amount</th>
              <th className="border p-2">Repaid Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-center">
                {format(new Date(loanData.loanDate), "MMM d, yyyy")}
              </td>
              <td className="border p-2 text-center">
                {formatCurrency(loanData.loanAmount)}
              </td>
              <td className="border p-2 text-center">
                {formatCurrency(loanData.repaidAmount || 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Loan Summary:</h3>
        <p>
          <strong>Total Loan Amount:</strong>{" "}
          {formatCurrency(loanData.loanAmount)}
        </p>
        <p>
          <strong>Total Repaid Amount:</strong>{" "}
          {formatCurrency(loanData.repaidAmount || 0)}
        </p>
        <p>
          <strong>Pending Amount:</strong>{" "}
          {formatCurrency(loanData.totalAmount || 0)}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Repay Loan:</h3>
        <div className="flex items-center">
          <input
            type="number"
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            placeholder="Enter amount to repay"
            className="p-2 border rounded mr-2 flex-grow"
          />
          <button
            onClick={handleRepay}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanComponents;
