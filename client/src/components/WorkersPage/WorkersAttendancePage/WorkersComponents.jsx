import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format, parseISO } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCheck, FaTimes, FaRupeeSign } from "react-icons/fa";

const WorkersComponents = ({ worker, attendance }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Helper function to render the attendance status
  const renderAttendanceStatus = (date) => {
    const matchedRecord = attendance.find(
      (record) =>
        record.worker === worker._id &&
        format(parseISO(record.date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
    );
    if (matchedRecord && matchedRecord.isPresent) {
      if (matchedRecord.borrowedMoney > 0) {
        return (
          <div className="absolute top-0 right-0 flex flex-col items-end">
            <FaCheck className="text-green-500 text-xl" />
            <div className="flex items-center text-sm font-bold text-indigo-800">
              <FaRupeeSign className="mr-1 text-lg" />
              {matchedRecord.borrowedMoney}
            </div>
          </div>
        );
      } else {
        return (
          <FaCheck className="text-green-500 text-2xl absolute top-1 right-1" />
        );
      }
    } else {
      return (
        <FaTimes className="text-red-500 text-2xl absolute top-1 right-1" />
      );
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-lg p-2 mb-4">Date Status for {worker.name}</div>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
          showDateDisplay={false}
          rangeColors={["#3e98c7"]}
          dateDisplayFormat="yyyy-MM-dd"
          className="bg-white rounded-lg shadow-lg p-4 w-full"
          calendarClassName="bg-white rounded-lg shadow-lg"
          dayClassName="relative flex items-center justify-center h-16 w-16 hover:bg-gray-200 cursor-pointer"
          dayContentRenderer={(date) => (
            <div className="relative flex items-center justify-center w-full h-full">
              <span className="text-lg font-medium">{date.getDate()}</span>
              {renderAttendanceStatus(date)}
            </div>
          )}
        />
        <div className="text-lg p-2 mb-4 grid grid-cols-3 gap-4">
          <p className="flex items-center justify-center gap-2">
            <FaCheck className="text-green-500 text-xl" />
            <FaRupeeSign className="text-indigo-800 text-xl" />
            Present + Borrowed
          </p>
          <p className="flex items-center justify-center gap-2">
            <FaCheck className="text-green-500 text-xl" /> Present
          </p>
          <p className="flex items-center justify-center gap-2">
            <FaTimes className="text-red-500 text-xl" /> Absent
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkersComponents;
