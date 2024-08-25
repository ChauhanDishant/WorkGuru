import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Authentication/Signup/Signup";
import Login from "./components/Authentication/Login/Login";
import HomePage from "./components/Home/HomePage";
import OptionsPage from "./components/Home/OptionsPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/Authentication/ProtectedRoute/ProtectedRoute";

// Imported Business Statements
import Sidebar from "./components/BusinessPage/BusinessSideBarPage/BusinessSideBarPage";
import Dashboard from "./components/BusinessPage/BusinessDashboardPage/Dashboard";
import AddWorker from "./components/BusinessPage/BusinessWorkerPage/AddWorker";
import AddRole from "./components/BusinessPage/BusinessRolePage/AddRole";
import ListOfRoles from "./components/BusinessPage/BusinessRolePage/ListOfRoles";
import ListOfWorkers from "./components/BusinessPage/BusinessWorkerPage/ListOfWorkers";
import AddProduct from "./components/BusinessPage/BusinessProductPage/AddProduct";
import EditProduct from "./components/BusinessPage/BusinessProductPage/EditProduct";
import ListOfProducts from "./components/BusinessPage/BusinessProductPage/ListOfProducts";
import AddStock from "./components/BusinessPage/BusinessStockPage/AddStock";
import ListOfStocks from "./components/BusinessPage/BusinessStockPage/ListOfStocks";
import AddRetailer from "./components/BusinessPage/BusinessRetailerPage/AddRetailer";
import ListofRetailers from "./components/BusinessPage/BusinessRetailerPage/ListOfRetailers";
import AddInvoice from "./components/BusinessPage/BusinessInvoicePage/AddInvoice";
import ListOfInvoices from "./components/BusinessPage/BusinessInvoicePage/ListOfInvoices";
import NotFound from "./components/Authentication/NotFound/NotFound";
import WorkersSideBarPage from "./components/WorkersPage/WorkersSideBarPage/WorkersSideBarPage";
import UserProfile from "./components/Authentication/UserProfile/UserProfile";
import EditProfile from "./components/Authentication/EditProfile/EditProfile";
import AddTask from "./components/WorkersPage/WorkersTaskPage/AddTask";
import ListOfTasks from "./components/WorkersPage/WorkersTaskPage/ListOfTasks";
import AddDepartment from "./components/WorkersPage/WorkersDepartmentPage/AddDepartment";
import ListOfDepartments from "./components/WorkersPage/WorkersDepartmentPage/ListOfDepartments";
import AddAttendance from "./components/WorkersPage/WorkersAttendancePage/AddAttendance";
import ListOfAttendance from "./components/WorkersPage/WorkersAttendancePage/ListOfAttendance";
import { EmployeeStatus } from "./components/WorkersPage/WorkersEmployeePage/EmployeeStatus.jsx";
import WorkersDashboard from "./components/WorkersPage/WorkersDashboard/WorkersDashboard.jsx";
import EmployeeLoan from "./components/WorkersPage/WorkersEmployeeLoan/EmployeeLoan.jsx";
import EmployeeLoanData from "./components/WorkersPage/WorkersEmployeeLoan/EmployeeLoanData.jsx";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<HomePage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Routes for the User Managemetn */}
          <Route
            path="/profile"
            element={<ProtectedRoute element={UserProfile} />}
          />
          <Route
            path="/edit-profile"
            element={<ProtectedRoute element={EditProfile} />}
          />

          {/* Routes for the Business Management*/}
          <Route
            path="/business/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path="/business"
            element={<ProtectedRoute element={Dashboard} />}
          />
          {/* Roles Routes */}
          <Route
            path="/business/addrole"
            element={<ProtectedRoute element={AddRole} />}
          />
          <Route
            path="/business/listofroles"
            element={<ProtectedRoute element={ListOfRoles} />}
          />
          {/* Workers Routes */}
          <Route
            path="/business/addworker"
            element={<ProtectedRoute element={AddWorker} />}
          />
          <Route
            path="/business/listofworkers"
            element={<ProtectedRoute element={ListOfWorkers} />}
          />
          {/* Products Routes */}
          <Route
            path="/business/addproduct"
            element={<ProtectedRoute element={AddProduct} />}
          />
          <Route
            path="/business/editproducts/:productId"
            element={<ProtectedRoute element={EditProduct} />}
          />
          <Route
            path="/business/listofproducts"
            element={<ProtectedRoute element={ListOfProducts} />}
          />
          {/* Stocks Routes */}
          <Route
            path="/business/addstock"
            element={<ProtectedRoute element={AddStock} />}
          />
          <Route
            path="/business/listofstocks"
            element={<ProtectedRoute element={ListOfStocks} />}
          />
          {/* Retailers Routes */}
          <Route
            path="/business/addretailer"
            element={<ProtectedRoute element={AddRetailer} />}
          />
          <Route
            path="/business/listofretailers"
            element={<ProtectedRoute element={ListofRetailers} />}
          />
          {/* Invoice Routes */}
          <Route
            path="/business/addinvoice"
            element={<ProtectedRoute element={AddInvoice} />}
          />
          <Route
            path="/business/listofinvoices"
            element={<ProtectedRoute element={ListOfInvoices} />}
          />

          {/* -------------------------------- Workers Routes ---------------------------*/}

          {/* Workers Page Dashboard */}
          <Route
            path="/workers/dashboard"
            element={<ProtectedRoute element={WorkersDashboard} />}
          />

          <Route
            path="/workers"
            element={<ProtectedRoute element={WorkersDashboard} />}
          />

          {/* Tasks Routes */}
          <Route
            path="/workers/addtasks"
            element={<ProtectedRoute element={AddTask} />}
          />
          <Route
            path="/workers/listoftasks"
            element={<ProtectedRoute element={ListOfTasks} />}
          />

          {/* Departments Routes */}
          <Route
            path="/workers/adddepartment"
            element={<ProtectedRoute element={AddDepartment} />}
          />
          <Route
            path="/workers/listofdepartments"
            element={<ProtectedRoute element={ListOfDepartments} />}
          />

          {/* Attendance Routes */}
          <Route
            path="/workers/addattendance"
            element={<ProtectedRoute element={AddAttendance} />}
          />
          <Route
            path="/workers/listofattendance"
            element={<ProtectedRoute element={ListOfAttendance} />}
          />
          {/* Employee Status Routes */}
          <Route
            path="/workers/employeestatus"
            element={<ProtectedRoute element={EmployeeStatus} />}
          />
          {/* Employee Loan Routes */}
          <Route
            path="/workers/employeeloan"
            element={<ProtectedRoute element={EmployeeLoan} />}
          />
          <Route
            path="/workers/employeeloandetails"
            element={<ProtectedRoute element={EmployeeLoanData} />}
          />

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
