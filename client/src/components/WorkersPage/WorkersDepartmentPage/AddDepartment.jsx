import React, { useState, useEffect } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const AddDepartment = () => {
  const [workers, setWorkers] = useState([]);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [selectedWorkerCount, setSelectedWorkerCount] = useState(1);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      axios.defaults.baseURL = "http://localhost:5000/";
      try {
        const res = await axios.get("/workguru/business/listofworkers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setWorkers(res.data.data);
          setTotalWorkers(res.data.data.length);
          setTimeout(() => {
            toast.success(res.data.message);
          }, 2000);
        }
      } catch (err) {
        setTimeout(() => {
          toast.error(err.message);
        }, 2000);
        console.log(err);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    setSelectedWorkers(Array(selectedWorkerCount).fill(null));
  }, [selectedWorkerCount]);

  const handleWorkerSelection = (index, workerId) => {
    console.log("Selected Worker ID:", workerId); // Debugging line
    const worker = workers.find((w) => w._id === workerId);
    const newSelectedWorkers = [...selectedWorkers];
    newSelectedWorkers[index] = worker;
    setSelectedWorkers(newSelectedWorkers);
  };

  const [confirmedSelections, setConfirmedSelections] = useState([]);

  const handleConfirmSelection = (index) => {
    if (confirmedSelections[index]) {
      toast.error("Worker already confirmed");
      return;
    }
    if (!selectedWorkers[index]) {
      toast.error("Please select a worker first");
      return;
    }
    const newConfirmedSelections = [...confirmedSelections];
    newConfirmedSelections[index] = true;
    setConfirmedSelections(newConfirmedSelections);
    toast.success(
      `Worker ${selectedWorkers[index].name} confirmed for row ${index + 1}`
    );
  };

  // Add the Department's Data
  const [departmentname, setDepartmentName] = useState("");
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();

    const selectedWorkerIds = selectedWorkers.map((worker) => worker._id);

    axios.defaults.baseURL = "http://localhost:5000/";
    try {
      const res = await axios.post(
        "/workguru/workers/adddepartments",
        { departmentname, workers: selectedWorkerIds }, // Pass array of worker IDs
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        console.log(res.data.message);
        window.location.reload();
      } else {
        console.log(res.data.message);
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Display the error message from the backend
        toast.error(
          err.response.data.message ||
            "An error occurred while adding the Department."
        );
      } else {
        // Handle unexpected errors
        toast.error("An error occurred while adding the loan.");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Department - Section</title>
      </Helmet>
      <WorkersSideBarPage>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            Department Form
          </h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>

          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
            <div className="text-blue-600 text-center font-bold text-xl">
              Total Workers: {totalWorkers}
            </div>
            <form onSubmit={handleDepartmentSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="departmentname"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Department Name:
                </label>
                <input
                  type="text"
                  id="departmentname"
                  name="departmentname"
                  className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400 pl-2"
                  placeholder="e.g Packaging"
                  onChange={(e) => {
                    setDepartmentName(e.target.value);
                  }}
                  required
                />
              </div>

              <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <label className="block mb-4">
                  <span className="text-gray-700">Number of Workers:</span>
                  <input
                    type="range"
                    min="1"
                    max={totalWorkers}
                    value={selectedWorkerCount}
                    onChange={(e) =>
                      setSelectedWorkerCount(parseInt(e.target.value))
                    }
                    className="w-full mt-1"
                  />
                  <span className="text-blue-600 font-bold">
                    {selectedWorkerCount}
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        Select Worker
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Phone Number
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Work Type
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWorkers.map((worker, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          <select
                            className="w-full p-2 border rounded"
                            onChange={(e) =>
                              handleWorkerSelection(index, e.target.value)
                            }
                            value={worker?._id || ""}
                          >
                            <option value="">Select Worker</option>
                            {workers
                              .filter(
                                (w) =>
                                  !selectedWorkers.some(
                                    (sw) => sw && sw._id === w._id
                                  ) || w._id === worker?._id
                              )
                              .map((w) => (
                                <option key={w._id} value={w._id}>
                                  {w.name}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {worker?.phonenumber || "NA"}{" "}
                          {/* Display worker's phone number */}
                        </td>
                        <td
                          className={`border border-gray-300 px-4 py-2 text-center ${
                            worker?.worktype === "dailybased"
                              ? "bg-blue-500 text-white"
                              : worker?.worktype === "taskbased"
                              ? "bg-orange-500 text-white"
                              : ""
                          } font-medium`}
                        >
                          {worker?.worktype || "NA"}{" "}
                          {/* Display worker's work type */}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleConfirmSelection(index)}
                            disabled={confirmedSelections[index]}
                            className={`px-4 py-2 rounded ${
                              worker && !confirmedSelections[index]
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {confirmedSelections[index]
                              ? "Confirmed"
                              : "Confirm"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="max-w-[25%] mx-auto mt-1 px-5 py-2 bg-blue-500 text-white text-center rounded">
                <button>Add Department</button>
              </div>
            </form>
          </div>
        </div>
      </WorkersSideBarPage>
    </>
  );
};

export default AddDepartment;
