import React, { useEffect, useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import toast from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { FaCheck, FaTimes, FaTimesCircle } from "react-icons/fa";

const AddAttendance = () => {
  const [workers, setWorkers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [borrowedmoney, setBorrowedMoney] = useState({});
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [attendance, setAttendance] = useState({});

  const workersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.baseURL = "http://localhost:5000/";
      try {
        const workersResponse = await axios.get(
          "/workguru/business/listofworkers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const rolesResponse = await axios.get(
          "/workguru/business/listofroles",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (workersResponse.data.success && rolesResponse.data.success) {
          setWorkers(workersResponse.data.data);
          setFilteredWorkers(workersResponse.data.data);
          setRoles(rolesResponse.data.data);
          toast.success("Data fetched successfully");
        } else {
          toast.error("Error in fetching the data");
        }
      } catch (err) {
        toast.error(err.message);
        console.log("Unable to fetch the data");
      }
    };

    fetchData();
  }, []);

  // Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = workers.filter((worker) =>
      worker.name.toLowerCase().includes(term)
    );
    setFilteredWorkers(filtered);
    setCurrentPage(0); // Reset to the first page on search
  };

  // Handle the Quantity Change
  const handleQuantityChange = (e, workerId) => {
    if (e.target.value < 0) {
      toast.error("Quantity cannot be negative");
      e.target.value = 0;
    }
    setQuantities((prev) => ({ ...prev, [workerId]: e.target.value }));
  };

  // Handle the Borrowed Money Change
  const handleMoneyChange = (e, workerId) => {
    if (e.target.value < 0) {
      toast.error("Negative Amount cannot be entered");
      e.target.value = 0;
    }
    setBorrowedMoney((prev) => ({ ...prev, [workerId]: e.target.value }));
  };

  // Handle the Paid Money Change
  const [paymentMoney, setPaymentMoney] = useState(0);
  const handlePaymentChange = (e, workerId) => {
    if (e.target.value < 0) {
      toast.error("Negative Amount cannot be enetered");
      e.target.value = 0;
    }
    setPaymentMoney((prev) => ({ ...prev, [workerId]: e.target.value }));
  };
  // Handle the Page Change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle the Roles Change
  const handleRoles = (e, workerIndex) => {
    const selectedRoleName = e.target.value;
    const updatedWorkers = filteredWorkers.map((worker, index) => {
      if (index === workerIndex) {
        return { ...worker, selectedRole: selectedRoleName };
      }
      return worker;
    });
    setFilteredWorkers(updatedWorkers);
  };

  const [leaveApproved, setLeaveApproved] = useState({});
  // Handle the Attendance Toggle Change
  const handleToggleChange = (workerId) => {
    if (!leaveApproved[workerId]) {
      // Allow attendance toggle only if leave is not approved
      setAttendance((prev) => ({
        ...prev,
        [workerId]: !prev[workerId], // Toggle the boolean value
      }));
    }
  };

  // Handle the Leave Approved Toggle Change
  const handleLeaveToggleChange = (workerId) => {
    setLeaveApproved((prev) => ({
      ...prev,
      [workerId]: !prev[workerId], // Toggle leave approval
    }));

    // If leave is approved, reset attendance, quantities, and borrowed money, and disable fields
    if (!leaveApproved[workerId]) {
      setAttendance((prev) => ({ ...prev, [workerId]: false }));
      setBorrowedMoney((prev) => ({ ...prev, [workerId]: 0 }));
      setQuantities((prev) => ({ ...prev, [workerId]: 0 }));
    }
  };

  // Calculation of the Total
  const calculateTotal = (worker, workerId) => {
    if (worker.worktype === "dailybased") {
      return worker.dailywages;
    } else {
      const roleWages =
        roles.find((role) => role.rolename === worker.selectedRole)?.wages || 0;
      return roleWages * (quantities[workerId] || 0);
    }
  };

  const start = currentPage * workersPerPage;
  const currentWorkers = filteredWorkers.slice(start, start + workersPerPage);

  // Handle the confirmation logic here
  const handleConfirmAttendance = async () => {
    try {
      axios.defaults.baseURL = "http://localhost:5000/";

      // Collect attendance data for all workers
      const workersData = filteredWorkers.map((worker) => ({
        worker: worker._id,
        isPresent: attendance[worker._id] || false,
        leaveApproved: leaveApproved[worker._id] || false,
        workType: worker.worktype,
        role: worker.selectedRole || undefined,
        quantity: quantities[worker._id] || 0,
        wages:
          worker.worktype === "dailybased"
            ? worker.dailywages || 0
            : roles.find((r) => r.rolename === worker.selectedRole)?.wages || 0,
        total: calculateTotal(worker, worker._id),
        borrowedMoney: borrowedmoney[worker._id] || 0,
        paymentMoney: paymentMoney[worker._id] || 0,
      }));

      console.log("Submitting attendance data:", { date, workersData });

      const res = await axios.post(
        "/workguru/workers/addattendance",
        {
          date: date,
          workers: workersData,
        },
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
        toast.error(res.data.message);
        console.log(res.data.message);
      }
    } catch (err) {
      console.error(
        "Error submitting attendance:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Determine if it is the last page
  const isLastPage =
    currentPage >= Math.ceil(filteredWorkers.length / workersPerPage) - 1;

  return (
    <>
      <Helmet>
        <title>Attendance - Section</title>
      </Helmet>
      <WorkersSideBarPage>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-6xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            Workers Attendance - {format(new Date(), "MMMM dd, yyyy")}
          </h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>

          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
            <div className="text-blue-600 text-center font-bold text-xl">
              Number Of Workers: {filteredWorkers.length}
            </div>
            <input
              type="text"
              placeholder="Search by worker name"
              value={searchTerm}
              onChange={handleSearch}
              className="mt-4 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="overflow-x-auto">
              <table className="w-full rounded-md border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2 text-left">No.</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Gender</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Attendance</th>
                    <th className="p-2 text-left">Role/Wages</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Total (₹)</th>
                    <th className="p-2 text-center">Lent (₹)</th>
                    <th className="p-2 text-center">Paid (₹)</th>
                    <th className="p-2 text-center">Leave Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWorkers.map((worker, index) => {
                    const workerIndex = start + index;
                    const isAbsent =
                      !attendance[worker._id] || leaveApproved[worker._id]; // Worker is absent if either attendance is not marked or leave is approved

                    return (
                      <tr key={worker._id} className="border-b">
                        <td className="p-2">{workerIndex + 1}</td>
                        <td className="p-2">{worker.name}</td>
                        <td className="p-2">
                          <span
                            className={
                              worker.gender === "male"
                                ? "text-blue-600"
                                : "text-pink-600"
                            }
                          >
                            {worker.gender}
                          </span>
                        </td>
                        <td className="p-2">{worker.worktype}</td>
                        <td className="p-2">
                          <label className="relative inline-flex cursor-pointer select-none items-center">
                            <input
                              type="checkbox"
                              checked={attendance[worker._id] || false}
                              onChange={() => handleToggleChange(worker._id)}
                              className="sr-only"
                              disabled={leaveApproved[worker._id]} // Disable if leave is approved
                            />
                            <span
                              className={`mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                                attendance[worker._id]
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              <span
                                className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                                  attendance[worker._id]
                                    ? ""
                                    : "translate-x-[28px]"
                                }`}
                              ></span>
                            </span>
                            {isAbsent ? (
                              <h1 className="text-red-500 font-bold">A</h1>
                            ) : (
                              <h1 className="text-green-500 font-bold">P</h1>
                            )}
                          </label>
                        </td>
                        <td className="p-2">
                          {worker.worktype === "dailybased" ? (
                            <div>{worker.dailywages}</div>
                          ) : (
                            <select
                              className={`w-full p-1 border rounded ${
                                isAbsent ? "bg-gray-100 cursor-not-allowed" : ""
                              }`}
                              value={worker.selectedRole || ""}
                              onChange={(e) => handleRoles(e, start + index)}
                              disabled={isAbsent} // Disable if absent
                            >
                              <option value="">Select Option</option>
                              {roles.map((role, index) => (
                                <option key={index} value={role.rolename}>
                                  {role.rolename} - ₹{role.wages}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="p-2">
                          {worker.worktype === "dailybased" ? (
                            "N/A"
                          ) : (
                            <input
                              type="number"
                              className={`w-full p-1 border rounded focus:outline-none focus:border-blue-500 ${
                                isAbsent ? "bg-gray-100 cursor-not-allowed" : ""
                              }`}
                              placeholder="Quantity"
                              min="1"
                              value={quantities[worker._id] || ""}
                              onChange={(e) =>
                                handleQuantityChange(e, worker._id)
                              }
                              disabled={isAbsent} // Disable if absent
                            />
                          )}
                        </td>
                        <td className="p-2">
                          ₹
                          {leaveApproved[worker._id]
                            ? worker.dailywages || 0
                            : attendance[worker._id]
                            ? calculateTotal(worker, worker._id)
                            : 0}
                        </td>

                        {/* Borrowed Money */}
                        <td className="p-2">
                          <input
                            type="number"
                            className={`w-full p-1 border rounded focus:outline-none focus:border-blue-500 ${
                              isAbsent ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                            placeholder="Borrowed Money"
                            min="0"
                            value={borrowedmoney[worker._id] || ""}
                            onChange={(e) => handleMoneyChange(e, worker._id)}
                            disabled={isAbsent} // Disable if absent
                          />
                        </td>
                        {/* Paid Money */}
                        <td className="p-2">
                          <input
                            type="number"
                            className={`w-full p-1 border rounded focus:outline-none focus:border-blue-500 ${
                              isAbsent ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                            placeholder="Paid Money"
                            min="0"
                            value={paymentMoney[worker._id] || ""}
                            onChange={(e) => handlePaymentChange(e, worker._id)}
                            disabled={isAbsent} // Disable if absent
                          />
                        </td>
                        
                        {worker.worktype === "dailybased" ? (
                          <td className="p-2">
                            <label className="relative inline-flex cursor-pointer select-none items-center">
                              <input
                                type="checkbox"
                                checked={leaveApproved[worker._id] || false}
                                onChange={() =>
                                  handleLeaveToggleChange(worker._id)
                                }
                                className="sr-only"
                                disabled={attendance[worker._id]} // Disable if attendance is marked as present
                              />
                              <span
                                className={`mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                                  leaveApproved[worker._id]
                                    ? "bg-indigo-500"
                                    : "bg-orange-500"
                                }`}
                              >
                                <span
                                  className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                                    leaveApproved[worker._id]
                                      ? ""
                                      : "translate-x-[28px]"
                                  }`}
                                ></span>
                              </span>
                              {leaveApproved[worker._id] ? (
                                <h1 className="text-indigo-500 font-bold">
                                  <FaCheck />
                                </h1>
                              ) : (
                                <h1 className="text-orange-500 font-bold">
                                  <FaTimes />
                                </h1>
                              )}
                            </label>
                          </td>
                        ) : (
                          <td className="p-2 text-center">
                            <span className="text-lg">N/A</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 font-md ">
              <div className="flex-1">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={Math.ceil(filteredWorkers.length / workersPerPage)}
                  onPageChange={handlePageChange}
                  containerClassName={
                    "pagination flex justify-center sm:justify-start space-x-2"
                  }
                  activeClassName={
                    "bg-blue-500 px-3 py-1 text-green-500 text-lg font-bold rounded-full shadow-lg"
                  }
                  pageLinkClassName={
                    "px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-200 transition-colors duration-200"
                  }
                  previousLinkClassName={
                    "px-3 py-1 rounded-full bg-green-500 text-white hover:bg-blue-700 transition-colors duration-200"
                  }
                  nextLinkClassName={
                    "px-3 py-1 rounded-full bg-green-500 text-white hover:bg-blue-700 transition-colors duration-200"
                  }
                />
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={handleConfirmAttendance}
                  className={`bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold px-6 py-2 rounded-full shadow-lg ${
                    !isLastPage ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={!isLastPage}
                >
                  Confirm Attendance
                </button>
              </div>
            </div>
          </form>
        </div>
      </WorkersSideBarPage>
    </>
  );
};

export default AddAttendance;
