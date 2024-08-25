import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const WorkersSideBarPage = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTasksSubmenuOpen, setisTasksSubmenuOpen] = useState(false);
  const [isDepartmentSubmenuOpen, setisDepartmentSubmenuOpen] = useState(false);
  const [isAttendanceSubmenuOpen, setisAttendanceSubmenuOpen] = useState(false);
  const [isEmployeeStatusSubmenuOpen, setisEmployeeStatusSubmenuOpen] =
    useState(false);
  const [isLoanSubmenuOpen, setIsLoanSubmenuOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTasksSubmenu = () => {
    setisTasksSubmenuOpen(!isTasksSubmenuOpen);
  };

  const toggleDepartmentsSubmenu = () => {
    setisDepartmentSubmenuOpen(!isDepartmentSubmenuOpen);
  };

  const toggleAttendanceSubmenu = () => {
    setisAttendanceSubmenuOpen(!isAttendanceSubmenuOpen);
  };

  const toggleEmloyeeStatusSubmenu = () => {
    setisEmployeeStatusSubmenuOpen(!isEmployeeStatusSubmenuOpen);
  };

  const toggleLoanSubmenu = () => {
    setIsLoanSubmenuOpen(!isLoanSubmenuOpen);
  };

  // For the Account Profile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Business Page</title>
      </Helmet>
      {/* ----------------------------------------------------------------------------------- */}
      <div className="flex bg-gray-100 h-screen">
        <div>
          <span
            className="absolute text-gray-600 text-4xl top-5 left-4 cursor-pointer"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars px-2 bg-gray-200 rounded-md"></i>
          </span>
          <div
            className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-white shadow-lg ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            <div className="text-gray-800 text-xl">
              <div className="p-2.5 mt-1 flex items-center">
                <i className="fas fa-briefcase px-2 py-1 rounded-md bg-blue-600 text-white"></i>
                <h1 className="font-bold text-gray-800 text-[20px] ml-3">
                  WorkGuru
                </h1>
                <i
                  className="fas fa-times cursor-pointer ml-[38%] lg:hidden"
                  onClick={toggleSidebar}
                ></i>
              </div>
              <div className="my-2 bg-gray-200 h-[1px]"></div>
            </div>

            {/* Home Section */}
            <Link
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
              to="/workers/dashboard"
            >
              <i className="fas fa-home text-blue-600"></i>
              <span className="text-[15px] ml-4 text-gray-700 font-medium">
                Dashboard
              </span>
            </Link>

            {/* Account Section */}
            <div className="relative">
              <Link
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
                to="/workers/dashboard"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <i className="fas fa-user-cog text-blue-600"></i>
                <span className="text-[15px] ml-4 text-gray-700 font-medium">
                  Account
                </span>
              </Link>

              {isOpen && (
                <div
                  className="w-full bg-white text-gray-800 rounded-md shadow-xl overflow-hidden"
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="block w-full p-3 flex items-center hover:bg-blue-50 transition-colors duration-200"
                  >
                    <i className="fas fa-user-circle mr-3 text-blue-600"></i>
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                  <Link
                    to="/edit-profile"
                    className="block w-full p-3 flex items-center hover:bg-blue-50 transition-colors duration-200"
                  >
                    <i className="fas fa-edit mr-3 text-blue-600"></i>
                    <span className="text-sm font-medium">Edit Profile</span>
                  </Link>
                  <button
                    onClick={handleLogOut}
                    className="block w-full p-3 flex items-center hover:bg-blue-50 transition-colors duration-200 text-left"
                  >
                    <i className="fas fa-sign-out-alt mr-3 text-blue-600"></i>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="my-4 bg-gray-200 h-[1px]"></div>

            {/* Tasks Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
              onClick={toggleTasksSubmenu}
            >
              <i className="fa-regular fa-square-check text-blue-600"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-gray-700 font-medium">
                  Tasks
                </span>
                <span
                  className={`text-sm ${
                    isTasksSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <i className="fas fa-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-gray-700 font-medium ${
                isTasksSubmenuOpen ? "" : "hidden"
              }`}
            >
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/addtasks"
              >
                <i className="fas fa-plus-circle mr-2 text-blue-600"></i>
                Add Tasks
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/listoftasks"
              >
                <i className="fas fa-list mr-2 text-blue-600"></i>
                List Of Tasks
              </Link>
            </div>

            {/* Departments Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
              onClick={toggleDepartmentsSubmenu}
            >
              <i className="fa-solid fa-building-columns text-blue-600"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-gray-700 font-medium">
                  Departments
                </span>
                <span
                  className={`text-sm ${
                    isDepartmentSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <i className="fas fa-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-gray-700 font-medium ${
                isDepartmentSubmenuOpen ? "" : "hidden"
              }`}
            >
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/adddepartment"
              >
                <i class="fa-solid fa-cart-plus mr-2 text-blue-600"></i>
                Add Department
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/listofdepartments"
              >
                <i className="fa-solid fa-table-list mr-2 text-blue-600"></i>
                List Of Departments
              </Link>
            </div>

            {/* Attendance Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
              onClick={toggleAttendanceSubmenu}
            >
              <i className="fas fa-box text-blue-600"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-gray-700 font-medium">
                  Attendance
                </span>
                <span
                  className={`text-sm ${
                    isAttendanceSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <i className="fas fa-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-gray-700 font-medium ${
                isAttendanceSubmenuOpen ? "" : "hidden"
              }`}
            >
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/addattendance"
              >
                <i className="fas fa-plus-square mr-2 text-blue-600"></i>
                Add Attendance
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/listofattendance"
              >
                <i className="fa-solid fa-chart-bar mr-2 text-blue-600"></i>
                Attendance Status
              </Link>
            </div>

            {/* Workers Status Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
              onClick={toggleEmloyeeStatusSubmenu}
            >
              <i className="fa-regular fa-circle-check text-green-600"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-gray-700 font-medium">
                  Salary Status
                </span>
                <span
                  className={`text-sm ${
                    isEmployeeStatusSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <i className="fas fa-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-gray-700 font-medium ${
                isEmployeeStatusSubmenuOpen ? "" : "hidden"
              }`}
            >
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/employeestatus"
              >
                <i className="fa-sharp fa-solid fa-person-digging mr-2 text-green-600"></i>
                Employee Salary
              </Link>
            </div>

            {/* Loan Status Section*/}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-100"
              onClick={toggleLoanSubmenu}
            >
              <i className="fa-solid fa-landmark text-blue-600"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-gray-700 font-medium">
                  Loan Details
                </span>
                <span
                  className={`text-sm ${
                    isLoanSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <i className="fas fa-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-gray-700 font-medium ${
                isLoanSubmenuOpen ? "" : "hidden"
              }`}
            >
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/employeeloan"
              >
                <i className="fa-solid fa-money-bill mr-2 text-blue-600"></i>
                Loan Procedure
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md mt-1 block"
                to="/workers/employeeloandetails"
              >
                <i className="fa-regular fa-rectangle-list mr-2 text-blue-600"></i>
                Loan Details
              </Link>
            </div>
            <button
              className="mt-5 px-6 py-2 text-md text-white bg-blue-500 rounded-lg hover:bg-blue-800"
              onClick={() => {
                window.location.href = "/business";
              }}
            >
              Business Section
            </button>
          </div>
        </div>
        {/* Main Content Area */}
        <div
          className={`flex-1 p-4 ${
            isSidebarOpen ? "ml-[300px]" : "ml-0"
          } lg:ml-[300px]`}
        >
          {children}
        </div>
      </div>
      {/* ----------------------------------------------------------------------------------- */}
    </>
  );
};

export default WorkersSideBarPage;
