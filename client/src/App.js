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
          <Route
            path="/workers"
            element={<ProtectedRoute element={WorkersSideBarPage} />}
          />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
