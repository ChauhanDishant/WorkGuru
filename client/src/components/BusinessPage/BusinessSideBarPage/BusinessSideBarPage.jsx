import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

const BusinessSideBarPage = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRolesSubmenuOpen, setIsRolesSubmenuOpen] = useState(false);
  const [isWorkersSubmenuOpen, setIsWorkersSubmenuOpen] = useState(false);
  const [isProductsSubmenuOpen, setIsProductsSubmenuOpen] = useState(false);
  const [isStocksSubmenuOpen, setIsStocksSubmenuOpen] = useState(false);
  const [isRetailersSubmenuOpen, setIsRetailersSubmenuOpen] = useState(false);
  const [isInvoiceSubmenuOpen, setIsInvoiceSubmenuOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRolesSubmenu = () => {
    setIsRolesSubmenuOpen(!isRolesSubmenuOpen);
  };

  const toggleWorkersSubmenu = () => {
    setIsWorkersSubmenuOpen(!isWorkersSubmenuOpen);
  };

  const toggleProductsSubmenu = () => {
    setIsProductsSubmenuOpen(!isProductsSubmenuOpen);
  };

  const toggleStocksSubmenu = () => {
    setIsStocksSubmenuOpen(!isStocksSubmenuOpen);
  };

  const toggleRetailersSubmenu = () => {
    setIsRetailersSubmenuOpen(!isRetailersSubmenuOpen);
  };

  const toggleInvoiceSubmenu = () => {
    setIsInvoiceSubmenuOpen(!isInvoiceSubmenuOpen);
  };

  // For the Account Profile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Business Page</title>
      </Helmet>
      <div className="flex bg-white h-screen">
        <div>
          <span
            className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
            onClick={toggleSidebar}
          >
            <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
          </span>
          <div
            className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-[#c8d4ec] ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            <div className="text-gray-100 text-xl">
              <div className="p-2.5 mt-1 flex items-center">
                <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600 text-white font-bold"></i>
                <h1 className="font-bold text-black text-[20px] ml-3">
                  WorkGuru
                </h1>
                <i
                  className="bi bi-x cursor-pointer ml-[32%] text-4xl lg:hidden text-black"
                  onClick={toggleSidebar}
                ></i>
              </div>
              <div className="my-2 bg-black h-[1.3px]"></div>
            </div>

            {/* Home Section */}

            <Link
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white"
              to="/business/dashboard"
            >
              <i className="bi bi-house-door-fill text-[#423A8E] font-bold"></i>
              <span className="text-[15px] ml-4 text-black font-bold">
                Dashboard
              </span>
            </Link>
            <div className="relative">
              <Link
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-500 cursor-pointer hover:bg-white"
                to="/business/dashboard"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <i className="bi bi-person-fill-gear text-[#423A8E] font-bold"></i>
                <span className="text-[15px] ml-4 text-black font-bold">
                  Account
                </span>
              </Link>

              {isOpen && (
                <div
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow-lg overflow-hidden"
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="block w-full p-3 flex items-center hover:bg-indigo-500 transition-colors duration-200"
                  >
                    <i className="bi bi-person-circle mr-3 text-lg"></i>
                    <span className="text-sm font-semibold">My Profile</span>
                  </Link>
                  <Link
                    to="/edit-profile"
                    className="block w-full p-3 flex items-center hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <i className="bi bi-pencil-square mr-3 text-lg"></i>
                    <span className="text-sm font-semibold">Edit Profile</span>
                  </Link>
                  <button
                    onClick={handleLogOut}
                    className="block w-full p-3 flex items-center hover:bg-indigo-700 transition-colors duration-200 text-left"
                  >
                    <i className="bi bi-box-arrow-right mr-3 text-lg"></i>
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="my-4 bg-black h-[1.4px]"></div>

            {/* Work Roles Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white"
              onClick={toggleRolesSubmenu}
            >
              <i className="bi bi-tools text-[#423A8E] font-bold"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-black font-bold">
                  Roles
                </span>
                <span
                  className={`text-sm ${
                    isRolesSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  id="arrow"
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-black font-bold ${
                isRolesSubmenuOpen ? "" : "hidden"
              }`}
              id="submenu-roles"
            >
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-2 grid grid-cols-[12%_auto]"
                to="/business/addrole"
              >
                <i className="bi bi-bag-plus-fill text-[#423A8E]"></i>
                <h1>Add Roles</h1>
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-1 grid grid-cols-[12%_auto]"
                to="/business/listofroles"
              >
                <i className="i bi-list-columns-reverse text-[#423A8E]"></i>
                <h1>List Of Roles</h1>
              </Link>
            </div>

            {/* Workers Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white"
              onClick={toggleWorkersSubmenu}
            >
              <i className="bi bi-people-fill text-[#423A8E] font-bold"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-black font-bold">
                  Workers
                </span>
                <span
                  className={`text-sm ${
                    isWorkersSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  id="arrow"
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-black font-bold ${
                isWorkersSubmenuOpen ? "" : "hidden"
              }`}
              id="submenu-workers"
            >
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-2 grid grid-cols-[12%_auto]"
                to="/business/addworker"
              >
                <i className="bi bi-person-plus-fill text-[#423A8E]"></i>
                <h1>Add Worker</h1>
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-1 grid grid-cols-[12%_auto]"
                to="/business/listofworkers"
              >
                <i className="bi bi-list-ul text-[#423A8E]"></i>
                <h1>List Of Workers</h1>
              </Link>
            </div>

            {/* Products Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white"
              onClick={toggleProductsSubmenu}
            >
              <i className="bi bi-box-seam text-[#423A8E]"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-black font-bold">
                  Products
                </span>
                <span
                  className={`text-sm ${
                    isProductsSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  id="arrow"
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-black font-bold ${
                isProductsSubmenuOpen ? "" : "hidden"
              }`}
              id="submenu-products"
            >
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-2 grid grid-cols-[12%_auto]"
                to="/business/addproduct"
              >
                <i className="bi bi-cloud-plus text-[#423A8E]"></i>
                <h1>Add Product</h1>
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-1 grid grid-cols-[12%_auto]"
                to="/business/listofproducts"
              >
                <i className="bi bi-list-ul text-[#423A8E]"></i>
                <h1>List Of Products</h1>
              </Link>
            </div>

            {/* Stocks Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white"
              onClick={toggleStocksSubmenu}
            >
              <i className="bi bi-graph-up-arrow text-[#423A8E]"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-black font-bold">
                  Stocks
                </span>
                <span
                  className={`text-sm ${
                    isStocksSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  id="arrow"
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-black font-bold ${
                isStocksSubmenuOpen ? "" : "hidden"
              }`}
              id="submenu-stocks"
            >
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-2 grid grid-cols-[12%_auto]"
                to="/business/addstock"
              >
                <i className="bi bi-plugin text-[#423A8E]"></i>
                <h1>Add Stocks</h1>
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-1 grid grid-cols-[12%_auto]"
                to="/business/listofstocks"
              >
                <i className="bi bi-card-checklist text-[#423A8E]"></i>
                <h1>List Of Stocks</h1>
              </Link>
            </div>

            {/* Retailers Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white text-black font-bold"
              onClick={toggleRetailersSubmenu}
            >
              <i className="bi bi-shop text-[#423A8E]"></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-black font-bold">
                  Retailers
                </span>
                <span
                  className={`text-sm ${
                    isRetailersSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  id="arrow"
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-black font-bold ${
                isRetailersSubmenuOpen ? "" : "hidden"
              }`}
              id="submenu-retailers"
            >
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-2 grid grid-cols-[12%_auto]"
                to="/business/addretailer"
              >
                <i className="bi bi-person-plus-fill text-[#423A8E] font-bold"></i>
                <h1>Add Retailer</h1>
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-1 grid grid-cols-[12%_auto]"
                to="/business/listofretailers"
              >
                <i className="bi bi-list-ul text-[#423A8E]"></i>
                <h1>List Of Retailers</h1>
              </Link>
            </div>

            {/* Invoice Section */}
            <div
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-white text-black"
              onClick={toggleInvoiceSubmenu}
            >
              <i className="bi bi-receipt-cutoff text-[#423A8E] "></i>
              <div className="flex justify-between w-full items-center">
                <span className="text-[15px] ml-4 text-black font-bold">
                  Invoice
                </span>
                <span
                  className={`text-sm ${
                    isInvoiceSubmenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                  id="arrow"
                >
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div
              className={`text-left text-sm mt-2 w-4/5 mx-auto text-black font-bold ${
                isInvoiceSubmenuOpen ? "" : "hidden"
              }`}
              id="submenu-invoice"
            >
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-2 grid grid-cols-[12%_auto]"
                to="/business/addinvoice"
              >
                <i className="bi bi-database-fill-add text-[#423A8E]"></i>
                <h1>Add Invoice</h1>
              </Link>
              <Link
                className="cursor-pointer p-2 hover:bg-white rounded-md mt-1 grid grid-cols-[12%_auto]"
                to="/business/listofinvoices"
              >
                <i className="bi bi-list-ul text-[#423A8E]"></i>
                <h1>List Of Invoices</h1>
              </Link>
            </div>
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
    </>
  );
};

export default BusinessSideBarPage;
