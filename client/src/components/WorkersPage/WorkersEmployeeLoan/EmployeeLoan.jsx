import React, { useEffect, useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const EmployeeLoan = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loanDate, setLoanDate] = useState(new Date());
  const [loanAmount, setLoanAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repaidAmount, setRepaidAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.baseURL =
          process.env.NODE_ENV === "production"
            ? "https://workguru-server.onrender.com"
            : "http://localhost:5000/";

        setIsLoading(true);
        const response = await axios.get("/workguru/business/listofworkers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setWorkers(response.data.data);
          toast.success("Workers data loaded successfully");
        } else {
          throw new Error("Failed to load data");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWorkerSelection = (e) => {
    const selectedName = e.target.value;
    const worker = workers.find((worker) => worker.name === selectedName);
    setSelectedWorker(worker);
  };

  const handleLoanAmountChange = (e) => {
    const amount = e.target.value;
    if (amount < 0) {
      toast.error("Loan amount cannot be negative");
      setLoanAmount("");
    } else {
      setLoanAmount(amount);
    }
  };

  const handleLoanAmountSubmit = async () => {
    if (!selectedWorker) return toast.error("Please select a worker");

    try {
      const addLoan = {
        workerId: selectedWorker._id, // Use the worker's unique ID
        loanDate: loanDate,
        loanAmount: loanAmount,
        repaidAmount: repaidAmount || 0,
        totalAmount: loanAmount,
      };

      const res = await axios.post("/workguru/workers/addloan", addLoan, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Loan applied successfully");
        window.location.reload(); // Refresh to reflect changes
      } else {
        toast.error(res.data.message || "Failed to apply loan");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Display the error message from the backend
        toast.error(
          err.response.data.message ||
            "An error occurred while adding the loan."
        );
      } else {
        // Handle unexpected errors
        toast.error("An error occurred while adding the loan.");
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }
  return (
    <>
      <Helmet>
        <title>Employee Loan</title>
      </Helmet>
      <WorkersSideBarPage>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-5xl shadow-lg">
          <h2 className="text-xl text-blue-600 font-bold mb-4 text-center">
            Employee Loan Status
          </h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>

          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-4xl">
            <div className="text-blue-600 text-center font-bold text-xl mb-4">
              Loan Procedure Form
            </div>

            {/* Loan Procedure Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Worker Selection */}
              <div className="flex flex-col">
                <label className="font-medium mb-2">Worker Name</label>
                <select
                  className="border p-2 rounded-md focus:border-blue-500"
                  onChange={handleWorkerSelection}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Worker
                  </option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker.name}>
                      {worker.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Date */}
              <div className="flex flex-col">
                <label className="font-medium mb-2">Loan Date</label>
                <DatePicker
                  selected={loanDate}
                  onChange={(date) => setLoanDate(date)}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition duration-200 ease-in-out shadow-sm bg-white text-gray-800 hover:bg-gray-100"
                />
              </div>

              {/* Loan Amount */}
              <div className="flex flex-col">
                <label className="font-medium mb-2">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  className="border p-2 rounded-md focus:border-blue-500"
                  placeholder="Enter loan amount in rupees"
                />
              </div>

              {/* Worker Details */}
              {selectedWorker && (
                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Phone Number */}
                  <div className="flex flex-col">
                    <label className="font-medium mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={selectedWorker.phonenumber}
                      readOnly
                      className="border p-2 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col">
                    <label className="font-medium mb-2">Gender</label>
                    <input
                      type="text"
                      value={selectedWorker.gender}
                      readOnly
                      className="border p-2 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Work Type */}
                  <div className="flex flex-col">
                    <label className="font-medium mb-2">Work Type</label>
                    <input
                      type="text"
                      value={selectedWorker.worktype}
                      readOnly
                      className="border p-2 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              className={`m-6 px-5 py-3 mx-auto ${
                selectedWorker ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
              } text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out`}
              disabled={!selectedWorker}
              onClick={handleLoanAmountSubmit}
            >
              Apply Loan
            </button>
          </div>
        </div>
      </WorkersSideBarPage>
    </>
  );
};

export default EmployeeLoan;
