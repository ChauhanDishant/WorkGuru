import React, { useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import states from "./states";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const AddRetailer = () => {
  const navigate = useNavigate();

  const [storename, setStoreName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [contactnumber, setContactNumber] = useState("");
  const [contactemail, setContactEmail] = useState("");
  const [contactaddress, setContactAddress] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    const selectedStateData = states.find((state) => state.state === stateName);
    setDistricts(selectedStateData ? selectedStateData.districts : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.baseURL = "http://localhost:5000/";

    const storenamePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    const firstnamePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    const lastnamePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    const contactnumberPattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    const contactemailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactaddressPattern = /^[a-zA-Z0-9\s,'-./]{3,}$/;
    const postalcodePattern = /^[1-9][0-9]{5}$/;

    if (!storenamePattern.test(storename)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    if (!firstnamePattern.test(firstname)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }
    if (!lastnamePattern.test(lastname)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }
    if (!contactnumberPattern.test(contactnumber)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }
    if (!contactemailPattern.test(contactemail)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }
    if (!contactaddressPattern.test(contactaddress)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }
    if (!postalcodePattern.test(postalcode)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/workguru/business/addretailers",
        {
          storename,
          firstname,
          lastname,
          contactnumber,
          contactemail,
          contactaddress,
          selectedState,
          district,
          postalcode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        console.log(res.data.message);
        toast.success(res.data.message);
        navigate("/business/listofretailers");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <BusinessSideBarPage>
      <Helmet>
          <title>Retailers Section</title>
        </Helmet>
      <div className="bg-[#e2d7c5] border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
        <h2 className="text-2xl text-[#825538] font-medium mb-4 text-center">
          Retail Application Form
        </h2>
        <div className="my-2 bg-[#af915c] h-[1.1px]"></div>
        <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="storename"
                className="block text-[#825538] text-lg font-medium mb-2"
              >
                Store Name
              </label>
              <input
                type="text"
                id="storename"
                name="storename"
                className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                placeholder="Wayne Bruce Store"
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <label
              htmlFor="age"
              className="block text-[#825538] text-lg font-medium mb-2"
            >
              Contact Person
            </label>
            <div className="grid grid-cols-[45%_auto] gap-3">
              <div className="mb-4">
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  s
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-[45%_auto] gap-3">
              <div className="mb-4">
                <label
                  htmlFor="contactnumber"
                  className="block text-[#825538] text-lg font-medium mb-2"
                >
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-[#825538]"
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
                    id="contactnumber"
                    name="contactnumber"
                    className="border border-[#825538] p-[6px] w-full pl-10 h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                    placeholder="1234567890"
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contactemail"
                  className="block text-[#825538] text-lg font-medium mb-2"
                >
                  Contact Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-[#825538]"
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
                    id="contactemail"
                    name="contactemail"
                    className="border border-[#825538] p-[6px] w-full h-[38px] pl-10 rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                    placeholder="abc@domain.com"
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="contactaddress"
                className="block text-[#825538] text-lg font-medium mb-2"
              >
                Contact Address
              </label>
              <input
                id="contactaddress"
                name="contactaddress"
                className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                placeholder="Contact Address"
                onChange={(e) => setContactAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {/* State Selection */}
              <div className="mb-4">
                <label
                  htmlFor="state"
                  className="block text-[#825538] text-lg font-medium mb-2"
                >
                  State
                </label>
                <select
                  className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option value="">Select a state</option>
                  {states.map((state, index) => (
                    <option key={index} value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>
              {/* District Selection */}
              <div className="mb-4">
                <label
                  htmlFor="district"
                  className="block text-[#825538] text-lg font-medium mb-2"
                >
                  District
                </label>
                <select
                  className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                  disabled={!selectedState}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                  }}
                >
                  <option value="">Select a district</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postalcode"
                  className="block text-[#825538] text-lg font-medium mb-2"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalcode"
                  name="postalcode"
                  className="border border-[#825538] p-[6px] pl-3 w-full h-[38px] rounded-md focus:outline-none focus:border-[#cfb380] focus:bg-white bg-[#efe9e0] placeholder-[#825538] text-[#ba7d38]"
                  placeholder="Postal Code"
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#825538] text-white px-4 p-[8px] rounded-lg hover:opacity-75 focus:outline-none focus:bg-blue-600"
              >
                Add Retailer
              </button>
            </div>
          </form>
        </div>
      </div>
    </BusinessSideBarPage>
  );
};

export default AddRetailer;
