import React, { useEffect, useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Modal from "react-modal";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./employeemodal.css";
import "./reportmodal.css";
import EmployeesComponents from "./EmployeesComponents";
import { format } from "date-fns";
import EmployeeReport from "./EmployeeReport";

// Modal settings for accessibility
Modal.setAppElement("#root");

export const EmployeeStatus = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [totalworkers, setTotalWorkers] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [loan, setLoan] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fetching the Data of Workers
  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.baseURL = "http://localhost:5000/";
      try {
        const WorkersResponse = await axios.get(
          "/workguru/business/listofworkers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const attendanceResponse = await axios.get(
          "/workguru/workers/listofattendance",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const loanResponse = await axios.get("/workguru/workers/listofloans", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (
          WorkersResponse.data.success &&
          attendanceResponse.data.success &&
          loanResponse.data.success
        ) {
          setWorkers(WorkersResponse.data.data);
          setAttendance(attendanceResponse.data.data);
          setLoan(loanResponse.data.data);
          console.log(attendanceResponse.data.data);
          setFilteredWorkers(WorkersResponse.data.data);
          // Initially set the filtered workers as all workers
          setTotalWorkers(WorkersResponse.data.data.length);
          setTimeout(() => {
            toast.success("Data Fetched Successfully");
          }, 5000);
        } else {
          setTimeout(() => {
            toast.error(WorkersResponse.data.message);
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    };

    fetchData();
  }, []);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(0);
  const workersPerPage = 5;

  // Slicing filtered workers for the current page
  const currentWorkers = filteredWorkers.slice(
    currentPage * workersPerPage,
    (currentPage + 1) * workersPerPage
  );

  // Handle the Page Change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Search Functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(term) ||
        worker.email.toLowerCase().includes(term)
    );
    setFilteredWorkers(filtered);
    setCurrentPage(0); // Reset to the first page on search
  };

  // Open modal and set the selected worker and attendance
  const openEmployeesModal = (worker, attendance) => {
    setSelectedWorker(worker);
    setSelectedAttendance(attendance);
    setIsEmployeesModalOpen(true);
  };

  const openReportModal = (worker, attendance) => {
    setSelectedWorker(worker);
    setSelectedAttendance(attendance);
    setIsReportModalOpen(true);
  };

  const closeEmployeesModal = () => {
    setIsEmployeesModalOpen(false);
    setSelectedWorker(null);
    setSelectedAttendance(null);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedWorker(null);
    setSelectedAttendance(null);
  };

  return (
    <>
      <Helmet>
        <title>Attendance - Section</title>
      </Helmet>
      <WorkersSideBarPage>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-5xl shadow-lg">
          <h2 className="text-xl text-blue-600 font-bold mb-4 text-center">
            Attendance Status - {format(new Date(), "MMMM dd, yyyy")}
          </h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>

          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-4xl">
            <div className="text-blue-600 text-center font-bold text-xl">
              Number Of Workers: {totalworkers}
            </div>

            <input
              type="text"
              placeholder="Search by worker's name or email address..."
              value={searchTerm}
              onChange={handleSearch}
              className="mt-4 mr-4 mb-4 w-full p-2 border border-gray-300 rounded-md"
            />

            {/* Table Data for the Workers */}
            <div className="overflow-x-auto">
              <table className="w-full rounded-md border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-2 text-left">No.</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-center">Gender</th>
                    <th className="p-2 text-center">Work-Type</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWorkers.map((worker, index) => (
                    <tr key={worker._id} className="border-b">
                      <td className="p-2">
                        {currentPage * workersPerPage + index + 1}
                      </td>
                      <td className="p-2">{worker.name}</td>
                      <td className="p-2">{worker.email}</td>
                      <td className="p-2 text-center">
                        <span
                          className={
                            worker.gender === "male"
                              ? "text-blue-600 text-lg"
                              : "text-pink-600 text-lg"
                          }
                        >
                          {worker.gender === "male" ? (
                            <>
                              <i className="bi bi-gender-male"></i> Male
                            </>
                          ) : (
                            <>
                              <i className="bi bi-gender-female"></i> Female
                            </>
                          )}
                        </span>
                      </td>
                      <td
                        className={`p-2 text-center ${
                          worker.worktype === "dailybased"
                            ? "bg-green-600 text-white"
                            : "bg-orange-600 text-white"
                        }`}
                      >
                        {worker.worktype}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          className="bg-indigo-600 text-white w-full rounded-lg p-2"
                          onClick={() =>
                            openEmployeesModal(worker, attendance, loan)
                          }
                        >
                          Salary Status
                        </button>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          className="bg-orange-600 text-white w-full rounded-lg p-2"
                          onClick={() => openReportModal(worker, attendance)}
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 font-md">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(filteredWorkers.length / workersPerPage)}
                onPageChange={handlePageChange}
                containerClassName="pagination flex justify-center sm:justify-start space-x-2"
                activeClassName={
                  "bg-blue-500 px-3 py-1 text-green-500 text-lg font-bold rounded-full shadow-lg"
                }
                pageLinkClassName="px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-200 transition-colors duration-200"
                previousLinkClassName="px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-200 transition-colors duration-200"
                nextLinkClassName="px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Modal for EmployeesComponent */}
            <Modal
              isOpen={isEmployeesModalOpen}
              onRequestClose={closeEmployeesModal}
              contentLabel="Worker Details"
              className="modal-employee-content"
              overlayClassName="modal-employee-overlay"
            >
              <div className="modal-header">
                <button
                  onClick={closeEmployeesModal}
                  className="close-employee-button"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {selectedWorker && (
                  <EmployeesComponents
                    worker={selectedWorker}
                    attendance={selectedAttendance}
                    loan={loan}
                  />
                )}
              </div>
            </Modal>

            {/* Modal for EmployeeReport */}
            <Modal
              isOpen={isReportModalOpen}
              onRequestClose={closeReportModal}
              contentLabel="Worker Details"
              className="modal-report-content"
              overlayClassName="modal-report-overlay"
            >
              <div className="modal-header">
                <button
                  onClick={closeReportModal}
                  className="close-report-button"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {selectedWorker && (
                  <EmployeeReport
                    worker={selectedWorker}
                    attendance={selectedAttendance}
                  />
                )}
              </div>
            </Modal>
          </div>
        </div>
      </WorkersSideBarPage>
    </>
  );
};
