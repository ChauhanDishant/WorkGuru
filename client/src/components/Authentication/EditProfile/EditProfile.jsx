import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import gujaratRegions from "./Region";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    phonenumber: "",
    email: "",
    address: "",
    gstNumber: "",
    district: "",
    taluka: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formValid, setFormValid] = useState(false);

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
          console.log("User data from API:", response.data.data);
          toast.success(response.data.message);
          setUser({
            name: response.data.data.name || "",
            phonenumber: response.data.data.phonenumber || "",
            email: response.data.data.email || "",
            address: response.data.data.address || "",
            gstNumber: response.data.data.gstNumber || "",
            district: response.data.data.district || "",
            taluka: response.data.data.taluka || "",
            password: "",
          });
          setSelectedDistrict(response.data.data.district || "");
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

  useEffect(() => {
    if (Array.isArray(gujaratRegions)) {
      const districtList = gujaratRegions.map((region) => region.district);
      setDistricts(districtList);

      if (selectedDistrict) {
        const district = gujaratRegions.find(
          (region) => region.district === selectedDistrict
        );
        if (district) {
          setTalukas(district.talukas || []);
        }
      }
    } else {
      console.error("gujaratRegions is not an array or is undefined");
    }
  }, [selectedDistrict]);

  const regexPatterns = {
    name: /^[a-zA-Z][a-zA-Z0-9\s&'-]{1,}$/,
    phonenumber: /^[0-9]{10}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    address: /^[a-zA-Z][a-zA-Z0-9\s&'-]{1,}$/,
    gstNumber: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    district: /^[a-zA-Z\s-]{2,50}$/,
    taluka: /^[a-zA-Z\s-]{2,50}$/,
  };

  const validateField = (name, value) => {
    if (name === "password") {
      // Allow any non-empty password or an empty password
      return true;
    }
    if (value === "" && !["name", "email", "phonenumber"].includes(name)) {
      console.log(`Validating ${name}: true (empty optional field)`);
      return true; // Allow empty values for optional fields
    }
    const isValid = regexPatterns[name]?.test(value) || false;
    console.log(`Validating ${name}: ${isValid}`);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleDistrictChange = (e) => {
    const selected = e.target.value;
    setSelectedDistrict(selected);
    setUser((prevUser) => ({
      ...prevUser,
      district: selected,
      taluka: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const updatedUser = { ...user };

    try {
      const response = await axios.put("/workguru/editprofile", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Failed to update profile. Please check your inputs.");
      console.error("Error updating user data:", error);
    }
  };

  useEffect(() => {
    const requiredFields = ["name", "email", "phonenumber"];
    const isValid = requiredFields.every(
      (field) => user[field] && validateField(field, user[field])
    );
    console.log("Form valid:", isValid);
    setFormValid(isValid);
  }, [user]);

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
    { label: "Password", name: "password", type: "password" },
    { label: "Address", name: "address" },
    { label: "GST Number", name: "gstNumber" },
    { label: "District", name: "district", options: districts },
    { label: "Taluka", name: "taluka", options: talukas },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Edit Your Business Details
              </h2>
              <p className="text-blue-100">Update your business information</p>
            </div>
          </div>

          <div className="px-8 py-10">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
              {formFields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                  </label>
                  {field.options ? (
                    <select
                      name={field.name}
                      id={field.name}
                      value={user[field.name] || ""}
                      onChange={
                        field.name === "district"
                          ? handleDistrictChange
                          : handleChange
                      }
                      className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                    >
                      <option value="" disabled>
                        Select {field.label}
                      </option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      id={field.name}
                      value={user[field.name] || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 px-4"
                    />
                  )}
                </div>
              ))}
              <div className="col-span-2 flex justify-end space-x-4 mt-10">
                <button
                  type="button"
                  className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formValid}
                  className={`px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    formValid
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
