import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

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
      const remainingAmount = loanData.loanAmount - loanData.repaidAmount;

      if (parseFloat(repayAmount) > remainingAmount) {
        toast.error(
          `Repay amount cannot exceed ${formatCurrency(remainingAmount)}.`
        );
        return;
      }

      const updatedRepaidAmount =
        loanData.repaidAmount + parseFloat(repayAmount);

      const response = await axios.put(
        `http://localhost:5000/workguru/workers/editloan/${loanData._id}`, // Adjust URL as needed
        {
          repaidAmount: updatedRepaidAmount,
          totalAmount: loanData.loanAmount - updatedRepaidAmount, // Update the total amount
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Update local state with new data
        setLoanData((prevState) => ({
          ...prevState,
          repaidAmount: updatedRepaidAmount,
          totalAmount: loanData.loanAmount - updatedRepaidAmount,
        }));
        setRepayAmount(""); // Reset the repay amount
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Loan Report for {loanData.workername || "N/A"}
      </h2>
      <p>
        <strong>Phone Number:</strong> {loanData.phonenumber}
      </p>
      <p>
        <strong>Gender:</strong> {loanData.gender}
      </p>
      <p>
        <strong>Work Type:</strong> {loanData.worktype}
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
