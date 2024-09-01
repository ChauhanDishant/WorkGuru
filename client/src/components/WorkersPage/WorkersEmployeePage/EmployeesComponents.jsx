import React, { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSunday,
  subMonths,
  isValid,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaMoneyBillWave,
  FaRupeeSign,
  FaUserTie,
} from "react-icons/fa";

const EmployeesComponents = ({ worker, attendance, loan }) => {
  const [monthStats, setMonthStats] = useState({
    currentMonth: "",
    presentDays: 0,
    absentDays: 0,
    totalWorkDone: 0,
    loanAmount: 0,
    totalBorrowed: 0,
    totalSalary: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    if (selectedMonth) {
      calculateMonthStats(selectedMonth);
    }
  }, [worker, attendance, loan, selectedMonth]);

  // Helper function to get the last 12 months
  const getLast12Months = () => {
    const months = [];
    let date = new Date();
    for (let i = 0; i < 12; i++) {
      months.push({
        label: format(date, "MMMM yyyy"),
        date: format(date, "yyyy-MM"), // Format date for option value
      });
      date = subMonths(date, 1);
    }
    return months;
  };

  const calculateMonthStats = (month) => {
    if (!(month instanceof Date) || isNaN(month.getTime())) {
      console.error("Invalid date:", month);
      return;
    }

    const currentMonth = format(month, "MMMM yyyy");
    const firstDay = startOfMonth(month);
    const lastDay = endOfMonth(month);

    // Get all days in the current month
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    // Filter out Sundays
    const workingDays = daysInMonth.filter((day) => !isSunday(day));

    // Calculate the number of days the worker was present
    const presentDays = attendance.filter(
      (record) =>
        record.worker === worker._id &&
        (record.isPresent || record.leaveApproved) &&
        parseISO(record.date) >= firstDay &&
        parseISO(record.date) <= lastDay
    ).length;

    // Calculate the total leaves approved for daily-based workers
    const totalLeavesApproved = attendance.filter(
      (record) =>
        record.worker === worker._id &&
        record.leaveApproved &&
        parseISO(record.date) >= firstDay &&
        parseISO(record.date) <= lastDay
    ).length;

    // Calculate absent days
    const absentDays = workingDays.length - presentDays;

    // Initialize total work done based on worker type
    let totalWorkDone = 0;

    // For daily-based workers, calculate based on present days and daily wages
    if (worker.worktype === "dailybased") {
      totalWorkDone = presentDays * worker.dailywages;
    }

    // For task-based workers, calculate based on tasks completed (if available in attendance)
    if (worker.worktype === "taskbased") {
      totalWorkDone = attendance.reduce(
        (sum, record) =>
          record.worker === worker._id &&
          record.isPresent &&
          parseISO(record.date) >= firstDay &&
          parseISO(record.date) <= lastDay
            ? sum + (record.total || 0) // Assuming `total` represents task earnings
            : sum,
        0
      );
    }

    // Calculate the total amount borrowed by the worker during the month
    const totalBorrowed = attendance.reduce(
      (sum, record) =>
        record.worker === worker._id &&
        parseISO(record.date) >= firstDay &&
        parseISO(record.date) <= lastDay
          ? sum + (record.borrowedMoney || 0)
          : sum,
      0
    );

    const totalLoanAmount = loan.reduce((sum, record) => {
      // Ensure worker._id is correctly compared (convert both to strings)
      const workerId = worker._id.toString();
      const recordWorkerId = record.worker.toString(); // In case record.worker is an ObjectId

      // Parse the loan date
      const loanDate = parseISO(record.loanDate);

      // Ensure the date is valid
      if (
        recordWorkerId === workerId &&
        isValid(loanDate) &&
        loanDate >= firstDay &&
        loanDate <= lastDay
      ) {
        // Add the loan amount (use 0 if it's undefined or null)
        return sum + (record.loanAmount || 0);
      }

      return sum;
    }, 0);

    // Calculate the final total salary by subtracting the borrowed amount from the total work done
    const totalSalary = totalWorkDone - totalBorrowed;

    // Update the month stats state
    setMonthStats({
      currentMonth,
      presentDays,
      absentDays,
      totalWorkDone,
      totalBorrowed,
      totalLeavesApproved,
      loanAmount: totalLoanAmount, // Set the loan amount for the month
      totalSalary,
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800 flex items-center">
        <FaUserTie className="mr-2" />
        {worker.name}'s Work & Salary Details
      </h2>

      <div className="flex justify-between items-center mb-6">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-600" />
          Select Month:
        </label>
        <select
          value={format(selectedMonth, "yyyy-MM")}
          onChange={(e) => setSelectedMonth(new Date(`${e.target.value}-01`))}
          className="px-4 py-2 bg-white border-2 border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {getLast12Months().map((month) => (
            <option key={month.date} value={month.date}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
            <FaClipboardList className="mr-2" />
            Work Details
          </h3>
          <p className="mb-2">
            <strong className="text-gray-700">Work-Type:</strong>{" "}
            <span className="text-indigo-600">{worker.worktype}</span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Days Present:</strong>{" "}
            <span className="text-green-600">{monthStats.presentDays}</span>
          </p>
          {worker.worktype === "dailybased" && (
            <p className="mb-2">
              <strong className="text-gray-700">Total Leaves:</strong>{" "}
              <span className="text-yellow-400">
                {monthStats.totalLeavesApproved}
              </span>
            </p>
          )}
          <p>
            <strong className="text-gray-700">Days Absent:</strong>{" "}
            <span className="text-red-600">{monthStats.absentDays}</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
            <FaMoneyBillWave className="mr-2" />
            Financial Summary
          </h3>
          <p className="mb-2 flex items-center">
            <strong className="text-gray-700 mr-2">Total Work Done:</strong>
            <FaRupeeSign className="text-green-600" />
            <span className="text-green-600">
              {monthStats.totalWorkDone} /-
            </span>
          </p>
          <p className="mb-2 flex items-center">
            <strong className="text-gray-700 mr-2">Loan Amount: </strong>
            <FaRupeeSign className="text-indigo-600" />
            <span className="text-indigo-600">{monthStats.loanAmount} /-</span>
          </p>
          <p className="mb-2 flex items-center">
            <strong className="text-gray-700 mr-2">Amount Borrowed:</strong>
            <FaRupeeSign className="text-red-600" />
            <span className="text-red-600">{monthStats.totalBorrowed} /-</span>
          </p>

          <p className="flex items-center">
            <strong className="text-gray-700 mr-2">Total Salary:</strong>
            <FaRupeeSign className="text-blue-600" />
            <span className="text-blue-600">{monthStats.totalSalary} /-</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeesComponents;
