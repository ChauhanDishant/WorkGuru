import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format, parseISO } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCheck, FaTimes, FaRupeeSign } from "react-icons/fa";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";

const EmployeesComponents = ({ worker, attendance }) => {
  return (
    <>
      <div className="px-5 py-1">
        <header className="text-blue-500 text-center font-medium">
          Work-Type:{" "}
          <span className="text-orange-500 uppercase">{worker.worktype}</span>
        </header>
        <div className="w-full border-b-2 border-gray-300 py-2"></div>
        <div className="mt-2">
          <h2 className="text-lg font-bold text-black">Attendance</h2>
          <div className="grid grid-rows-1 gap-1">
            <p>No. of Days Present (in this Month): </p>
            <p>No. of Days Absent (in this Month): </p>
            <p>Total Work Done (in this Month): </p>
            <p>Total Amount Borrowed: ₹</p>
            <p>Total Salary: </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeesComponents;
