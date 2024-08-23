import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { format, startOfWeek, startOfMonth, eachDayOfInterval } from "date-fns";

const EmployeeReport = ({ worker, attendance }) => {
  const [monthData, setMonthData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    generateMonthlyData();
    generateWeeklyData();
    generateTaskData();
  }, [worker, attendance]);

  const generateMonthlyData = () => {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: today });

    const data = daysInMonth.map((day) => {
      const dayAttendance = attendance.filter(
        (record) => new Date(record.date).toDateString() === day.toDateString()
      );

      const presentCount = dayAttendance.filter(
        (r) => r.isPresent && r.worker === worker._id
      ).length;

      return {
        date: format(day, "dd MMM"),
        total: 1, // Assuming one possible attendance per day
        present: presentCount,
      };
    });

    setMonthData(data);
  };

  const generateWeeklyData = () => {
    const today = new Date();
    const firstDayOfWeek = startOfWeek(today);
    const daysInWeek = eachDayOfInterval({ start: firstDayOfWeek, end: today });

    const data = daysInWeek.map((day) => {
      const dayAttendance = attendance.filter(
        (record) => new Date(record.date).toDateString() === day.toDateString()
      );

      const presentCount = dayAttendance.filter(
        (r) => r.isPresent && r.worker === worker._id
      ).length;

      return {
        date: format(day, "dd MMM"),
        total: 1, // Assuming one possible attendance per day
        present: presentCount,
      };
    });

    setWeekData(data);
  };

  const generateTaskData = () => {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: today });

    const data = daysInMonth.map((day) => {
      const dayAttendance = attendance.filter(
        (record) => new Date(record.date).toDateString() === day.toDateString()
      );

      const quantityCompleted = dayAttendance.reduce(
        (sum, record) =>
          record.worker === worker._id && record.quantity
            ? sum + record.quantity
            : sum,
        0
      );

      return {
        date: format(day, "dd MMM"),
        quantity: quantityCompleted,
      };
    });

    setTaskData(data);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">
        {worker.name}'s Performance Report
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Performance Graph */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            This Month's Active Performance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                name="Total Days"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#82ca9d"
                name="Present Days"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance Graph */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            This Week's Active Performance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                name="Total Days"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#82ca9d"
                name="Present Days"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task-Based Performance Graph */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            This Month's Task Performance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="quantity"
                fill="#8884d8"
                name="Quantity Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;
