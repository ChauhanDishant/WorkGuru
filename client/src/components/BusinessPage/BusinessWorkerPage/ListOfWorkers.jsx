import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const ListOfWorkers = () => {
  // used for fetching the data
  const [workersdata, setWorkersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(5);

  // used for true or false
  const [editWorker, setEditWorker] = useState(false);
  const [editname, setEditName] = useState("");
  const [editage, setEditAge] = useState("");
  const [editphonenumber, setEditPhoneNumber] = useState("");
  const [editemail, setEditEmail] = useState("");
  const [editgender, setEditGender] = useState("");
  const [editaddress, setEditAddress] = useState("");
  const [editworktype, setEditWorkType] = useState("");
  const [editdailywages, setEditDailyWages] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        axios.defaults.baseURL = "http://localhost:5000/";

        const res = await axios.get("/workguru/business/listofworkers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setWorkersData(res.data.data);
          console.log(res.data.data);
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

    fetchWorkers();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // --------------------------- Edit Function Starts ------------------------

  // 1st Part
  const handleEditChange = (workers) => {
    setEditWorker(workers);
    setEditName(workers.name);
    setEditAge(workers.age);
    setEditPhoneNumber(workers.phonenumber);
    setEditEmail(workers.email);
    setEditGender(workers.gender);
    setEditAddress(workers.address);
    setEditWorkType(workers.worktype);
    setEditDailyWages(workers.dailywages);
  };

  // 2nd Part
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: editname,
        age: editage,
        phonenumber: editphonenumber,
        email: editemail,
        gender: editgender,
        address: editaddress,
        worktype: editworktype,
        dailywages: editdailywages,
      };

      const res = await axios.put(
        `/workguru/business/editworkers/${editWorker._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedworkers = workersdata.map((workersdata) => {
          if (workersdata._id === editWorker._id) {
            return { ...workersdata, ...updatedData };
          } else {
            return workersdata;
          }
        });
        setWorkersData(updatedworkers);
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
  // ------------------------------- Edit Function Ends -------------------------------

  // ------------------------- Delete Function Starts ----------------------------
  const handleDelete = async (workerId) => {
    try {
      const res = await axios.delete(
        `/workguru/business/deleteworkers/${workerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        // keep those roles which you should not want to delete.
        setWorkersData(
          workersdata.filter((role) => workersdata._id !== workerId)
        );
        // window.location.reload();
      }
    } catch (error) {
      toast.error("Error deleting role");
      console.error("Error deleting role:", error);
    }
  };
  // ------------------------- Delete Function Ends -------------------------------
  const Images = [
    "https://tecdn.b-cdn.net/img/new/avatars/2.webp",
    "https://tuk-cdn.s3.amazonaws.com/assets/components/avatars/a_3_0.png",
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80",
  ];

  const filteredWorkers = workersdata.filter((worker) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      worker.name.toLowerCase().includes(searchTermLowerCase) ||
      worker.age.toString().includes(searchTermLowerCase) ||
      worker.email.toLowerCase().includes(searchTermLowerCase) ||
      worker.worktype.toLowerCase().includes(searchTermLowerCase)
    );
  });

  // Pagination logic
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>Workers Section</title>
        </Helmet>
        {editWorker ? (
          <>
            <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                Edit Workers
              </h2>
              <div className="my-2 bg-blue-500 h-[1.1px]"></div>
              <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                      value={editname}
                      onChange={(e) => {
                        setEditName(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-[25%_auto] gap-3">
                    <div className="mb-4">
                      <label
                        htmlFor="age"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                        value={editage}
                        onChange={(e) => {
                          setEditAge(e.target.value);
                        }}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phonenumber"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 19 18"
                          >
                            <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          id="phonenumber"
                          name="phonenumber"
                          className="border border-gray-400 p-[6px] w-full pl-10 rounded-lg focus:outline-none focus:border-blue-400"
                          value={editphonenumber}
                          onChange={(e) => {
                            setEditPhoneNumber(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[55%_auto] gap-3">
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Your Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 16"
                          >
                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                            <path d="M11.245 9.514a2.515 2.515 0 0 1-3.086 0L0 3.63v9.37A2 2 0 0 0 2 15h16a2 2 0 0 0 2-2V3.63l-8.755 5.884Z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="border border-gray-400 p-[6px] w-full pl-10 rounded-lg focus:outline-none focus:border-blue-400"
                          value={editemail}
                          onChange={(e) => {
                            setEditEmail(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="gender"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                        value={editgender}
                        onChange={(e) => {
                          setEditGender(e.target.value);
                        }}
                        required
                      >
                        <option disabled selected>
                          Select Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                      value={editaddress}
                      onChange={(e) => {
                        setEditAddress(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-[55%_auto] gap-3">
                    <div className="mb-4">
                      <label
                        htmlFor="worktype"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Work Type
                      </label>
                      <select
                        id="worktype"
                        name="worktype"
                        className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                        value={editworktype}
                        onChange={(e) => {
                          setEditWorkType(e.target.value);
                        }}
                        required
                      >
                        <option value="" disabled selected>
                          Select Work Type
                        </option>
                        <option value="dailybased">Daily Based</option>
                        <option value="taskbased">Task Based</option>
                      </select>
                    </div>
                    {editworktype === "dailybased" && (
                      <div className="mb-4">
                        <label
                          htmlFor="dailywages"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Daily Wages
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 20"
                            >
                              <path d="M9 20a4.55 4.55 0 0 1-2.867-8.04l3.159-2.513A2.56 2.56 0 1 0 5.56 6.4H3.56A4.552 4.552 0 0 1 9 0a4.55 4.55 0 0 1 2.867 8.04l-3.159 2.513a2.56 2.56 0 1 0 3.732 3.048H14.44A4.552 4.552 0 0 1 9 20Z" />
                            </svg>
                          </div>
                          <input
                            type="number"
                            id="dailywages"
                            name="dailywages"
                            className="border border-gray-400 p-[6px] w-full pl-10 rounded-lg focus:outline-none focus:border-blue-400"
                            value={editdailywages}
                            onChange={(e) => {
                              setEditDailyWages(e.target.value);
                            }}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="bg-gray-500 text-white p-2 rounded-lg"
                        onClick={() => setEditWorker(null)}
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
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-4xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">
                List of Workers
              </h2>
              <div className="my-4 bg-blue-500 h-[1.1px]"></div>
              <div className="flex items-center justify-between pb-4 bg-white">
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="mt-4 p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-blue-300">
                    <i className="bi bi-search text-lg text-gray-500"></i>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-[15px] ml-4 w-full text-gray-700 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-white uppercase bg-blue-500">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Age
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Work-Role
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Edit
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Delete
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {currentWorkers.length > 0 &&
                      currentWorkers.map((workers, index) => (
                        <tr
                          key={workers._id}
                          className={`border-b dark:border-gray-700 text-black ${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-100`}
                        >
                          <th
                            scope="row"
                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                          >
                            <img
                              className="w-10 h-10 p-1 rounded-full ring-1 ring-gray-300 dark:ring-gray-500"
                              src={[Images[index % Images.length]]}
                              alt={workersdata.name}
                            />
                            <div className="pl-3">
                              <div className="text-base font-semibold">
                                {workers.name}
                              </div>
                              <div className="font-normal text-gray-500">
                                {workers.email}
                              </div>
                            </div>
                          </th>
                          <td className="px-6 py-4">{workers.age}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div
                                className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                  workers.worktype === "dailybased"
                                    ? "bg-green-500"
                                    : "bg-orange-500"
                                }`}
                              ></div>
                              {workers.worktype}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline
                            "
                              onClick={() => {
                                handleEditChange(workers);
                              }}
                            >
                              Edit user
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="font-medium text-blue-600 dark:text-red-500 hover:underline"
                              onClick={() => {
                                handleDelete(workers._id);
                              }}
                            >
                              Delete user
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div>
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredWorkers.length / workersPerPage)}
                </div>
                <div>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredWorkers.length / workersPerPage)
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </BusinessSideBarPage>
    </>
  );
};

export default ListOfWorkers;
