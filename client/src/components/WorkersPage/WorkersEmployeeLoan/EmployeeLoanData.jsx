import React, { useEffect, useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import Modal from "react-modal";
import LoanComponents from "./LoanComponents";
import { toast } from "react-hot-toast";
import axios from "axios";
import { format } from "date-fns";
import LoadingSpinner from "./../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "./../../LoadingScreen/ErrorDisplay";
import ReactPaginate from "react-paginate";
import "./LoanModal.css";

const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

const EmployeeLoanData = () => {
  const [loanData, setLoanData] = useState([]);
  const [filteredLoanData, setFilteredLoanData] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isEmployeesLoanModalOpen, setIsEmployeesLoanModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loansResponse = await axios.get("/workguru/workers/listofloans", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          baseURL: "http://localhost:5000",
        });
        console.log("Loans Response:", loansResponse.data.data);

        const loansData = Array.isArray(loansResponse.data.data)
          ? loansResponse.data.data
          : [];

        setLoanData(loansData);
        setFilteredLoanData(loansData);
        toast.success("Data fetched successfully");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
        toast.error(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = loanData.filter((loan) => {
      const workerName = loan.worker?.name || "";
      return workerName.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredLoanData(filteredData);
  }, [searchQuery, loanData]);

  const openEmployeesLoanModal = (loan) => {
    setSelectedLoan(loan);
    setIsEmployeesLoanModalOpen(true);
  };

  const closeEmployeesLoanModal = () => {
    setIsEmployeesLoanModalOpen(false);
    setSelectedLoan(null);
    window.location.reload();
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const today = format(new Date(), "MMMM d, yyyy");

  const offset = currentPage * itemsPerPage;
  const paginatedLoanData = filteredLoanData.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredLoanData.length / itemsPerPage);

  return (
    <WorkersSideBarPage>
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-6xl shadow-lg">
          <h1 className="text-3xl text-blue-600 font-bold mb-2 text-center">
            Employee Loan Data
          </h1>
          <p className="text-gray-600 text-center mb-6">As of {today}</p>
          <div className="my-4 bg-blue-500 h-[2px]"></div>

          <div className="mb-4 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name"
              className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {paginatedLoanData.length > 0 ? (
            <>
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="border p-4 text-left text-blue-600">
                      Worker Name
                    </th>
                    <th className="border p-4 text-left text-blue-600">
                      Phone Number
                    </th>
                    <th className="border p-4 text-left text-blue-600">
                      Work Type
                    </th>
                    <th className="border p-4 text-left text-blue-600">
                      Loan Amount
                    </th>
                    <th className="border p-4 text-left text-blue-600">
                      Repaid Amount
                    </th>
                    <th className="border p-4 text-left text-blue-600">
                      Total Amount
                    </th>
                    <th className="border p-4 text-left text-blue-600">
                      Loan Date
                    </th>
                    <th className="border p-4 text-center text-blue-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLoanData.map((loan) => (
                    <tr key={loan._id} className="hover:bg-gray-50">
                      <td className="border p-4">
                        {loan.worker?.name || "N/A"}
                      </td>
                      <td className="border p-4">
                        {loan.worker?.phonenumber || "N/A"}
                      </td>
                      <td className="border p-4">
                        {loan.worker?.worktype || "N/A"}
                      </td>
                      <td className="border p-4">
                        {formatCurrency(loan.loanAmount)}
                      </td>
                      <td className="border p-4">
                        {formatCurrency(loan.repaidAmount)}
                      </td>
                      <td className="border p-4">
                        {formatCurrency(loan.totalAmount)}
                      </td>
                      <td className="border p-4 text-center">
                        {format(new Date(loan.loanDate), "MMM d, yyyy")}
                      </td>
                      <td className="border p-4 text-center">
                        <button
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-200"
                          onClick={() => openEmployeesLoanModal(loan)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-center">
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            </>
          ) : (
            <p className="text-center">No loan data available.</p>
          )}
        </div>
        <Modal
          isOpen={isEmployeesLoanModalOpen}
          onRequestClose={closeEmployeesLoanModal}
          contentLabel="Employee Loan Details"
          className="modal-loan-content"
          overlayClassName="modal-loan-overlay"
        >
          <div className="modal-header">
            <button
              onClick={closeEmployeesLoanModal}
              className="close-loan-button text-2xl font-bold"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            {selectedLoan && <LoanComponents loan={selectedLoan} />}
          </div>
        </Modal>
      </div>
    </WorkersSideBarPage>
  );
};

export default EmployeeLoanData;
