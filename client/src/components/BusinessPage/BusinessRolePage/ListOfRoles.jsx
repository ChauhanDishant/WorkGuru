import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const ListOfRoles = () => {
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [editRole, setEditRole] = useState(null);

  const [editrolename, setEditRoleName] = useState();
  const [editwages, setEditWages] = useState();

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
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("Error fetching roles");
        console.error("Error fetching roles:", error);
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
        window.location.reload();
        // keep those roles which you should not want to delete.
        setRoles(roles.filter((role) => role._id !== roleId));
      }
    } catch (error) {
      toast.error("Error deleting role");
      console.error("Error deleting role:", error);
    }
  };

  // 1st. This function is called to edit the role
  const handleEdit = (role) => {
    setEditRole(role);
    setEditRoleName(role.rolename);
    setEditWages(role.wages);
  };

  // 2nd. This function is called to set the data on the input.
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

        window.location.reload();
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

  return (
    <BusinessSideBarPage>
      <Helmet>
        <title>Roles Section</title>
      </Helmet>

      <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-6 max-w-2xl shadow-lg">
        {/* Edit Role Form */}
        {editRole ? (
          <>
            <h2 className="text-2xl font-medium mb-4 text-center">Edit Role</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Role Name</label>
                <input
                  type="text"
                  name="rolename"
                  value={editrolename} // Initial Values
                  onChange={(e) => {
                    setEditRoleName(e.target.value);
                  }}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Wages</label>
                <input
                  type="number"
                  name="wages"
                  value={editwages} // Initial Values
                  onChange={(e) => {
                    setEditWages(e.target.value);
                  }}
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
              List of Roles
            </h2>
            <div className="my-2 bg-blue-500 h-[1.1px]"></div>
            <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
              <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-400 bg-white shadow-lg">
                <header className="border-b border-gray-400 px-5 py-4 text-center">
                  <div className="font-bold text-xl text-gray-800">
                    Manage Roles
                  </div>
                </header>

                <table className="w-full table-auto">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
                    <tr>
                      <th></th>
                      <th className="p-2">
                        <div className="text-left font-semibold">Role Name</div>
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
                    {roles.map((role) => (
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
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 17.25V21h3.75l11.61-11.61-3.75-3.75L3 17.25zM14.7 6.3a1.875 1.875 0 112.65-2.65 1.875 1.875 0 01-2.65 2.65z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                            <div className="flex justify-center">
                              <button onClick={() => deleteRole(role._id)}>
                                <svg
                                  className="h-8 w-8 rounded-full p-1 hover:bg-gray-100 hover:text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Amount */}
                <div className="flex justify-end space-x-4 border-t border-gray-100 px-5 py-4 text-2xl font-bold">
                  <div>Total</div>
                  <div className="text-blue-600">
                    Rs <span>{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <input
                    type="hidden"
                    className="border border-black bg-gray-50"
                    value={selected}
                    readOnly
                  />
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
