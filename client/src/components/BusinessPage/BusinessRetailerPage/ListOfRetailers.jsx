import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const ListOfRetailers = () => {
  const [retailersData, setRetailersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const retailersPerPage = 5;

  const [editRetailer, setEditRetailer] = useState(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editContactNumber, setEditContactNumber] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editContactAddress, setEditContactAddress] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        axios.defaults.baseURL = "http://localhost:5000/";
        const res = await axios.get("/workguru/business/listofretailers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setRetailersData(res.data.data);
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

    fetchRetailers();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const handleEditChange = (retailer) => {
    setEditRetailer(retailer);
    setEditStoreName(retailer.storename);
    setEditFirstName(retailer.firstname);
    setEditLastName(retailer.lastname);
    setEditContactNumber(retailer.contactnumber);
    setEditContactEmail(retailer.contactemail);
    setEditContactAddress(retailer.contactaddress);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        storename: editStoreName,
        firstname: editFirstName,
        lastname: editLastName,
        contactnumber: editContactNumber,
        contactemail: editContactEmail,
        contactaddress: editContactAddress,
      };

      const res = await axios.put(
        `/workguru/business/editretailers/${editRetailer._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedRetailers = retailersData.map((retailerData) => {
          if (retailerData._id === editRetailer._id) {
            return { ...retailerData, ...updatedData };
          } else {
            return retailerData;
          }
        });
        setRetailersData(updatedRetailers);
        setEditRetailer(null);
      }
    } catch (error) {
      toast.error(
        `Error updating retailer: ${
          error.response?.data?.message || "Server error"
        }`
      );
      console.error("Error updating retailer:", error);
    }
  };

  const handleDelete = async (retailerId) => {
    try {
      const res = await axios.delete(
        `/workguru/business/deleteretailers/${retailerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setRetailersData(
          retailersData.filter((retailer) => retailer._id !== retailerId)
        );
      }
    } catch (error) {
      toast.error("Error deleting retailer");
      console.error("Error deleting retailer:", error);
    }
  };

  const filteredRetailers = retailersData.filter((retailer) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      (retailer.storename &&
        retailer.storename.toLowerCase().includes(searchTermLowerCase)) ||
      (retailer.firstname &&
        retailer.firstname.toLowerCase().includes(searchTermLowerCase)) ||
      (retailer.lastname &&
        retailer.lastname.toLowerCase().includes(searchTermLowerCase))
    );
  });

  const indexOfLastRetailer = currentPage * retailersPerPage;
  const indexOfFirstRetailer = indexOfLastRetailer - retailersPerPage;
  const currentRetailers = filteredRetailers.slice(
    indexOfFirstRetailer,
    indexOfLastRetailer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <BusinessSideBarPage>
      <Helmet>
        <title>Retailers Section</title>
      </Helmet>
      {editRetailer ? (
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Edit Retailer</h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>
          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="storename"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  id="storename"
                  name="storename"
                  className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                  value={editStoreName}
                  onChange={(e) => setEditStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-4">
                  <label
                    htmlFor="firstname"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lastname"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contactnumber"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactnumber"
                  name="contactnumber"
                  className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                  required
                />
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
                  value={editContactAddress}
                  onChange={(e) => setEditContactAddress(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-center">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-500 text-white p-2 rounded-lg"
                    onClick={() => setEditRetailer(null)}
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
      ) : (
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-5xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            List of Retailers
          </h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>
          <div className="my-4 flex justify-center">
            <input
              type="text"
              placeholder="Search by Store name or Name"
              className="w-[40%] border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-blue-500 text-white font-bold">
                    Store Name
                  </th>
                  <th className="py-2 px-4 bg-blue-500 text-white font-bold">
                    Name
                  </th>
                  <th className="py-2 px-4 bg-blue-500 text-white font-bold">
                    Contact Number
                  </th>
                  <th className="py-2 px-4 bg-blue-500 text-white font-bold">
                    Address
                  </th>
                  <th className="py-2 px-4 bg-blue-500 text-white font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRetailers.map((retailer) => (
                  <tr key={retailer._id}>
                    <td className="border px-4 py-2">{retailer.storename}</td>
                    <td className="border px-4 py-2">
                      {retailer.firstname} {retailer.lastname}
                    </td>
                    <td className="border px-4 py-2">
                      {retailer.contactnumber}
                    </td>
                    <td className="border px-4 py-2">
                      {retailer.contactaddress}
                    </td>
                    <td className="border px-4 py-2 flex space-x-2 justify-center">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg"
                        onClick={() => handleEditChange(retailer)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg"
                        onClick={() => handleDelete(retailer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            {Array.from(
              {
                length: Math.ceil(filteredRetailers.length / retailersPerPage),
              },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </BusinessSideBarPage>
  );
};

export default ListOfRetailers;
