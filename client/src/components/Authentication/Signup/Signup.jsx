import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import gujaratRegions from "./Region";

const Signup = () => {
  const [name, setName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gstNumber, setgstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  // ---------------------------------------------------
  const [fromGujarat, setFromGujarat] = useState(true);
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setDistrict("");
    setTaluka("");
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setTaluka("");
  };

  const navigate = useNavigate();

  axios.defaults.baseURL =
    process.env.NODE_ENV === "production"
      ? "https://workguru-server.onrender.com"
      : "http://localhost:5000/";

  const handleSignup = async (e) => {
    e.preventDefault();

    const businessNameRegex = /^[a-zA-Z][a-zA-Z0-9\s&'-]{1,}$/;
    const phoneNumberRegex = /^[0-9]{10}$/;
    const businessEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const gstNumberRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const addressRegex = /^[a-zA-Z][a-zA-Z0-9\s&'-]{1,}$/;
    const districtNameRegex = /^[a-zA-Z\s-]{2,50}$/;
    const talukaNameRegex = /^[a-zA-Z\s-]{2,50}$/;

    if (!businessNameRegex.test(name)) {
      toast.error(
        "Business name must start with a letter and be at least 2 characters long."
      );
      return;
    }

    if (!phoneNumberRegex.test(phonenumber)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!businessEmailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Invalid format for the Password");
      return;
    }

    if (!addressRegex.test(address)) {
      toast.error("Address is not defined properly");
      return;
    }
    if (!gstNumberRegex.test(gstNumber)) {
      toast.error("GST Number must be written properly");
      return;
    }

    if (!districtNameRegex.test(district)) {
      toast.error("District name must be written properly");
    }

    if (!talukaNameRegex.test(taluka)) {
      toast.error("Taluka name must be written properly");
    }
    try {
      const res = await axios.post("/workguru/signup", {
        name,
        phonenumber,
        email,
        password,
        address,
        gstNumber,
        district,
        taluka,
      });

      if (res.data.success) {
        toast.success("User created successfully.");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      console.error("Signup Error:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup Page</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-6 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-6">
            <div>
              <img
                src="WorkGuru_Logo.png"
                className="max-w-[205px] mx-auto"
                alt="WorkGuru Logo"
              />
            </div>
            <div className="mt-4 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
              <div className="w-full flex-1 mt-4">
                <div className="mx-auto max-w-xl gap-3">
                  <div className="grid md:grid-cols-1 mb-4">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      name="name"
                      type="text"
                      placeholder="Your Business Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-[47%_auto] grid-cols-1 mb-4 gap-3">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Phone Number"
                      value={phonenumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-[47%_auto] gap-3 mb-4">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="GSTNumber"
                      value={gstNumber}
                      onChange={(e) => setgstNumber(e.target.value)}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-[47%_auto] gap-3 mb-4">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {fromGujarat && (
                      <select
                        className="w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-md focus:outline-none focus:border-gray-400 focus:bg-white"
                        value={region}
                        onChange={handleRegionChange}
                      >
                        <option value="">Select Region</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Other Regions">Other Regions</option>
                      </select>
                    )}

                    {region === "Gujarat" && (
                      <>
                        <select
                          className="w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-md focus:outline-none focus:border-gray-400 focus:bg-white"
                          value={district}
                          onChange={handleDistrictChange}
                        >
                          <option value="">Select District</option>
                          {gujaratRegions.map((region, index) => (
                            <option key={index} value={region.district}>
                              {region.district}
                            </option>
                          ))}
                        </select>

                        {district && (
                          <select
                            className="w-full px-4 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-md focus:outline-none focus:border-gray-400 focus:bg-white"
                            value={taluka}
                            onChange={(e) => setTaluka(e.target.value)}
                          >
                            <option value="">Select Taluka</option>
                            {gujaratRegions
                              .find((region) => region.district === district)
                              .talukas.map((taluka, index) => (
                                <option key={index} value={taluka}>
                                  {taluka}
                                </option>
                              ))}
                          </select>
                        )}
                      </>
                    )}

                    {region === "Other Regions" && (
                      <>
                        <input
                          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                          type="text"
                          placeholder="District"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                        <input
                          className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                          type="text"
                          placeholder="Taluka"
                          value={taluka}
                          onChange={(e) => setTaluka(e.target.value)}
                        />
                      </>
                    )}
                  </div>
                  <button
                    className="mt-3 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    onClick={handleSignup}
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy={7} r={4} />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Sign Up</span>
                  </button>
                  <p className="text-gray-500 text-lg mt-1">
                    Already Registered?
                    <span className="mx-1 text-blue-600 underline">
                      <Link to="/login">Login</Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-4 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("/Signup_Image.png")',
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
