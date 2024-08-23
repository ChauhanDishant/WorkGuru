import React, { useEffect, useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const ListOfTasks = () => {
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [edittaskname, setEditTaskName] = useState();
  const [editwages, setEditWages] = useState();

  // Pagination and Search
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      axios.defaults.baseURL = "http://localhost:5000/";
      try {
        const res = await axios.get("/workguru/business/listofroles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setRoles(res.data.data);
          toast.success("Tasks fetched Successfully");
        }
      } catch (error) {
        toast.error("Error fetching tasks");
        console.error("Error fetching tasks:", error);
      }
    };

    fetchRoles();
  }, []);

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
      toast.error("Error deleting task");
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (role) => {
    setEditRole(role);
    setEditTaskName(role.rolename);
    setEditWages(role.wages);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        rolename: edittaskname.trim(),
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
        toast.success("Tasks updated Successfully");
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
        `Error updating Task: ${
          error.response?.data?.message || "Server error"
        }`
      );
      console.error("Error updating task:", error);
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
    <WorkersSideBarPage>
      <Helmet>
        <title>Tasks Section</title>
      </Helmet>

      <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-6 max-w-2xl shadow-lg">
        {editRole ? (
          <>
            <h2 className="text-2xl font-medium mb-4 text-center">
              Edit Tasks
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Tasks Name</label>
                <input
                  type="text"
                  name="rolename"
                  value={edittaskname}
                  onChange={(e) => setEditTaskName(e.target.value)}
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
            <h2 className="text-2xl font-medium mb-4 text-center">
              List of Tasks
            </h2>
            <div className="my-2 bg-blue-500 h-[1.1px]"></div>
            <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by Tasks name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>

              <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-400 bg-white shadow-lg">
                <header className="border-b border-gray-400 px-5 py-4 text-center">
                  <div className="font-bold text-xl text-gray-800">
                    Manage Tasks
                  </div>
                </header>

                <table className="w-full table-auto">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
                    <tr>
                      <th></th>
                      <th className="p-2">
                        <div className="text-left font-semibold">Task Name</div>
                      </th>
                      <th className="p-2">
                        <div className="text-left font-semibold">Wages</div>
                      </th>
                      <th className="p-2">
                        <div className="text-center font-semibold">Action</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-sm">
                    {currentRoles.map((role) => (
                      <tr key={role._id}>
                        <td className="p-2">
                          <input
                            type="checkbox"
                            className="h-5 w-5"
                            value={role._id}
                            onClick={(e) => toggleCheckbox(e, role)}
                          />
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-gray-800">
                            {role.rolename}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-left font-bold text-green-500">
                            Rs. {role.wages}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="grid grid-cols-2">
                            <div className="flex justify-center">
                              <button onClick={() => handleEdit(role)}>
                                <svg
                                  className="h-8 w-8 rounded-full p-1 hover:bg-gray-100 hover:text-blue-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0l-10 10a2 2 0 00-.586 1.414V17a1 1 0 001 1h3.586a2 2 0 001.414-.586l10-10a2 2 0 000-2.828l-3.586-3.586zM12.707 5.293l-7 7L5 13l.707-1.707 7-7 1.414 1.414zm-1.414 9.414L7.5 14.5 12.5 9.5 13.793 10.793l-2.5 2.5zm-4 2h-2v-2h1.293l1.5 1.5H7.5z" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex justify-center">
                              <button
                                onClick={() => deleteRole(role._id)}
                                className="text-red-500"
                              >
                                <svg
                                  className="h-8 w-8 rounded-full p-1 hover:bg-gray-100 hover:text-red-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-.883.993L5 3v1H4a1 1 0 00-.117 1.993L4 6h12a1 1 0 00.117-1.993L16 4h-1V3a1 1 0 00-.883-.993L14 2H6zM5 7v9a2 2 0 002 2h6a2 2 0 002-2V7H5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`mx-1 px-3 py-1 rounded-full ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-4 text-lg text-center">
                  Selected Task Count: {selected.length} | Total Wages: Rs.{" "}
                  {total}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WorkersSideBarPage>
  );
};

export default ListOfTasks;
