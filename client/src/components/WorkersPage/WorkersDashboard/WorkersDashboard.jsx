import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import useFullscreen from "./../../../components/useFullScreen/useFullScreen"; // Adjust the path as needed
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";

const WorkersDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.baseURL =
        process.env.NODE_ENV === "production"
          ? "https://workguru-server.onrender.com"
          : "http://localhost:5000/";
      try {
        const attendanceResponse = await axios.get(
          "/workguru/workers/listofattendance",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const workersResponse = await axios.get(
          "/workguru/business/listofworkers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (attendanceResponse.data.success && workersResponse.data.success) {
          setAttendance(attendanceResponse.data.data);
          setWorkers(workersResponse.data.data);
          toast.success("Data loaded successfully");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleWorkerSelection = (e) => {
    const workerId = e.target.value;
    const worker = workers.find((w) => w._id === workerId);
    setSelectedWorker(worker);
  };

  const getFilteredAttendance = () => {
    if (!selectedWorker) return [];

    return attendance
      .filter((record) => record.worker === selectedWorker._id)
      .map((record) => ({
        date: new Date(record.date).toLocaleDateString(),
        present: record.isPresent ? 1 : 0,
        quantity: record.quantity || 0,
        wages: record.total || 0,
      }));
  };

  const getRadarChartData = () => {
    const filteredData = getFilteredAttendance();
    const presentDays = filteredData.reduce(
      (total, record) => total + record.present,
      0
    );
    const totalTasks = filteredData.reduce(
      (total, record) => total + record.quantity,
      0
    );
    const totalWages = filteredData.reduce(
      (total, record) => total + record.wages,
      0
    );

    return [
      { metric: "Present Days", value: presentDays },
      { metric: "Tasks Completed", value: totalTasks },
      { metric: "Wages", value: totalWages },
    ];
  };

  const getWagesChartData = () => {
    return getFilteredAttendance().map((record) => ({
      date: record.date,
      quantity: record.quantity,
      wages: record.wages,
    }));
  };

  const chartColors = {
    primary: "#6366f1",
    secondary: "#22c55e",
    tertiary: "#f59e0b",
    background: "#f3f4f6",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Animation Effects
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the loading animation to finish
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Adjust this duration to match your loading screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <WorkersSideBarPage>
        <Helmet>
          <title>WorkGuru - Dashboard</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        {isLoading ? (
          <>
            <LoadingScreen />
          </>
        ) : (
          <>
            <div className="p-6 bg-gray-100 min-h-screen font-['Poppins']">
              <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800">
                Workers Dashboard
              </h2>

              <div className="mb-8">
                <label
                  htmlFor="workerSelect"
                  className="block text-xl font-semibold mb-3 text-gray-700"
                >
                  Select Worker:
                </label>
                <select
                  id="workerSelect"
                  onChange={handleWorkerSelection}
                  className="p-3 border border-gray-300 rounded-lg w-full text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                >
                  <option value="">Select a worker</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedWorker && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Monthly Activeness Chart */}
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                    <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
                      Monthly Activeness
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={getFilteredAttendance()}>
                        <defs>
                          <linearGradient
                            id="colorPresent"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={chartColors.primary}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={chartColors.primary}
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="present"
                          stroke={chartColors.primary}
                          strokeWidth={3}
                          dot={{
                            stroke: chartColors.primary,
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{ r: 8 }}
                          fill="url(#colorPresent)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Radar Chart for Monthly Performance */}
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                    <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
                      Monthly Performance Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={getRadarChartData()}>
                        <PolarGrid stroke="#e0e0e0" />
                        <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                        <PolarRadiusAxis stroke="#6b7280" />
                        <Radar
                          dataKey="value"
                          stroke={chartColors.secondary}
                          fill={chartColors.secondary}
                          fillOpacity={0.6}
                        />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stacked Bar Chart for Wages and Tasks */}
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 lg:col-span-2">
                    <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
                      Wages and Tasks Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={getWagesChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="quantity"
                          stackId="a"
                          fill={chartColors.primary}
                        />
                        <Bar
                          dataKey="wages"
                          stackId="a"
                          fill={chartColors.tertiary}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </WorkersSideBarPage>
    </>
  );
};

export default WorkersDashboard;
