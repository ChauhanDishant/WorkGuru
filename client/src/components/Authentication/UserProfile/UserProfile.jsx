import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    phonenumber: "",
    email: "",
    address: "",
    gstNumber: "",
    district: "",
    taluka: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://workguru-server.onrender.com"
        : "http://localhost:5000/";

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/workguru/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          console.log(response.data.data);
          toast.success(response.data.message);
          setUser(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formFields = [
    { label: "Business Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Phone Number", name: "phonenumber" },
    { label: "Address", name: "address" },
    { label: "GST Number", name: "gstNumber" },
    { label: "District", name: "district" },
    { label: "Taluka", name: "taluka" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Your Business Details
              </h2>
              <p className="text-blue-100">Here is your business information</p>
            </div>
            <div className="hidden sm:block">
              <svg
                className="w-32 h-32 text-white opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {formFields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    id={field.name}
                    value={user[field.name] || ""}
                    readOnly
                    className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                  />
                </div>
              ))}
              <button
                className="bg-blue-600 w-[26%] mx-auto h-[38px] text-white rounded-lg uppercase shadow-lg focus:opacity-75"
                onClick={() => {
                  navigate("/business");
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
