import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const ListOfRoles = () => {
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [editrolename, setEditRoleName] = useState();
  const [editwages, setEditWages] = useState();

  // Pagination and Search
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Loading Screen
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      axios.defaults.baseURL =
        process.env.NODE_ENV === "production"
          ? "https://workguru-server.onrender.com"
          : "http://localhost:5000/";
      try {
        const res = await axios.get("/workguru/business/listofroles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setRoles(res.data.data);
          toast.success(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
        toast.error(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const toggleCheckbox = (event, role) => {
    const { checked } = event.target;
    const roleWages = parseFloat(role.wages);

    if (checked) {
      setSelected([...selected, role._id]);
      setTotal(total + roleWages);
    } else {
      setSelected(selected.filter((item) => item !== role._id));
      setTotal(total - roleWages);
    }
  };

  const deleteRole = async (roleId) => {
    try {
      const res = await axios.delete(
        `/workguru/business/deleteroles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setRoles(roles.filter((role) => role._id !== roleId));
      }
    } catch (error) {
      toast.error("Error deleting role");
      console.error("Error deleting role:", error);
    }
  };

  const handleEdit = (role) => {
    setEditRole(role);
    setEditRoleName(role.rolename);
    setEditWages(role.wages);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        rolename: editrolename.trim(),
        wages: parseFloat(editwages),
      };

      if (isNaN(updatedData.wages) || updatedData.wages <= 0) {
        toast.error("Wages must be a positive number");
        return;
      }

      const res = await axios.put(
        `/workguru/business/editroles/${editRole._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedRoles = roles.map((role) => {
          if (role._id === editRole._id) {
            return { ...role, ...updatedData };
          } else {
            return role;
          }
        });
        setRoles(updatedRoles);
        setEditRole(null);
      }
    } catch (error) {
      toast.error(
        `Error updating role: ${
          error.response?.data?.message || "Server error"
        }`
      );
      console.error("Error updating role:", error);
    }
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.rolename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <BusinessSideBarPage>
      <Helmet>
        <title>Roles Section</title>
      </Helmet>

      <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-6 max-w-2xl shadow-lg">
        {editRole ? (
          <>
            <h2 className="text-2xl font-medium mb-4 text-center">Edit Role</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Role Name</label>
                <input
                  type="text"
                  name="rolename"
                  value={editrolename}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Wages</label>
                <input
                  type="number"
                  name="wages"
                  value={editwages}
                  onChange={(e) => setEditWages(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditRole(null)}
                  className="bg-gray-500 text-white p-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
              List of Roles
            </h2>
            <div className="my-2 bg-blue-600 h-[2px] mx-auto max-w-lg"></div>
            <div className="rounded-lg px-4 py-6 mx-auto my-4 max-w-3xl bg-white shadow-xl">
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search by role name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full text-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full rounded-lg border border-gray-300 bg-white shadow-md">
                <header className="border-b border-gray-300 px-6 py-4 bg-blue-100 text-center">
                  <div className="font-bold text-xl text-gray-800">
                    <i className="fas fa-users-cog mr-2"></i> Manage Roles
                  </div>
                </header>

                <table className="w-full table-auto">
                  <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                    <tr>
                      <th></th>
                      <th className="p-3">
                        <div className="text-left font-semibold">Role Name</div>
                      </th>
                      <th className="p-3">
                        <div className="text-left font-semibold">Wages</div>
                      </th>
                      <th className="p-3">
                        <div className="text-center font-semibold">Actions</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-sm">
                    {currentRoles.map((role) => (
                      <tr key={role._id}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                            value={role._id}
                            onClick={(e) => toggleCheckbox(e, role)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-gray-800">
                            {role.rolename}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-left font-bold text-green-500">
                            Rs. {role.wages}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center space-x-4">
                            <button onClick={() => handleEdit(role)}>
                              <i className="fas fa-edit text-blue-500 hover:text-blue-700 text-xl"></i>
                            </button>
                            <button onClick={() => deleteRole(role._id)}>
                              <i className="fas fa-trash-alt text-red-500 hover:text-red-700 text-xl"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-full ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      } hover:bg-blue-400 hover:text-white`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-6 text-lg text-center bg-blue-50 rounded-lg">
                  <i className="fas fa-check-circle text-blue-500 mr-2"></i>{" "}
                  Selected Role Count:{" "}
                  <span className="font-bold">{selected.length}</span> | Total
                  Wages: <span className="font-bold">Rs. {total}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BusinessSideBarPage>
  );
};

export default ListOfRoles;
