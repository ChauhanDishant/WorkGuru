import React, { useEffect, useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";

const ListOfDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPages, setCurrentPages] = useState({});
  const workersPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      axios.defaults.baseURL = "http://localhost:5000/";
      const token = localStorage.getItem("token");

      try {
        const [workersResponse, departmentsResponse] = await Promise.all([
          axios.get("/workguru/business/listofworkers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/workguru/workers/listofdepartments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (workersResponse.data.success && departmentsResponse.data.success) {
          setWorkers(workersResponse.data.data);
          setDepartments(departmentsResponse.data.data);
          initializeCurrentPages(departmentsResponse.data.data);
          toast.success("Data fetched successfully");
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "An error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const initializeCurrentPages = (departments) => {
    const pages = {};
    departments.forEach((dept) => {
      pages[dept._id] = 1;
    });
    setCurrentPages(pages);
  };

  const departmentsWithWorkers = departments.map((department) => ({
    ...department,
    workers: department.workers
      .map((workerId) => workers.find((worker) => worker._id === workerId))
      .filter(Boolean),
  }));

  const handleDeleteDepartment = async (departmentId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `/workguru/workers/deletedepartment/${departmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setDepartments((prev) =>
          prev.filter((department) => department._id !== departmentId)
        );
        toast.success("Department deleted successfully");
      } else {
        toast.error("Failed to delete department");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
      console.error(err);
    }
  };

  const changePage = (departmentId, newPage) => {
    setCurrentPages((prev) => ({ ...prev, [departmentId]: newPage }));
  };

  const renderPagination = (department) => {
    const pageCount = Math.ceil(department.workers.length / workersPerPage);
    const currentPage = currentPages[department._id];

    return (
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() =>
            changePage(department._id, Math.max(1, currentPage - 1))
          }
          disabled={currentPage === 1}
          className="px-2 py-1 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => changePage(department._id, page)}
            className={`px-2 py-1 mx-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() =>
            changePage(department._id, Math.min(pageCount, currentPage + 1))
          }
          disabled={currentPage === pageCount}
          className="px-2 py-1 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-300"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>List of Departments | WorkGuru</title>
      </Helmet>
      <WorkersSideBarPage>
        <div className="bg-gray-100 min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Departments Overview
            </h1>
            {isLoading ? (
              <div className="text-center">
                <div className="spinner"></div>
                <p className="mt-2 text-gray-600">Loading departments...</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-building text-blue-500 text-2xl mr-2"></i>
                      <span className="text-xl font-semibold text-gray-700">
                        Total Departments: {departments.length}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-users text-green-500 text-2xl mr-2"></i>
                      <span className="text-xl font-semibold text-gray-700">
                        Total Workers: {workers.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentsWithWorkers.map((department) => (
                    <div
                      key={department._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="bg-blue-500 p-4 grid grid-cols-[90%_auto]">
                        <h3 className="text-xl font-bold text-white">
                          {department.departmentname}
                        </h3>
                        <button
                          className="text-xl font-bold text-white"
                          onClick={() => handleDeleteDepartment(department._id)}
                        >
                          <i className="fa-solid fa-delete-left"></i>
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">
                          <i className="fas fa-users mr-2"></i>
                          Workers: {department.workers.length}
                        </p>
                        <ul className="space-y-2">
                          {department.workers
                            .slice(
                              (currentPages[department._id] - 1) *
                                workersPerPage,
                              currentPages[department._id] * workersPerPage
                            )
                            .map((worker) => (
                              <li
                                key={worker._id}
                                className="flex items-center text-gray-700"
                              >
                                <i className="fas fa-user-tie mr-2 text-blue-500"></i>
                                <span className="font-medium">
                                  {worker.name}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ({worker.worktype})
                                </span>
                              </li>
                            ))}
                        </ul>
                        {renderPagination(department)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </WorkersSideBarPage>
    </>
  );
};

export default ListOfDepartments;
