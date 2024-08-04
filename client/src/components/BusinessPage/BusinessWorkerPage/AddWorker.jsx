import React, { useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const AddWorker = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [worktype, setWorkType] = useState("");
  const [dailywages, setDailyWages] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.baseURL = "http://localhost:5000/";

    const namePattern = /^[a-zA-Z\s]+$/;
    const agePattern = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
    const phoneNumberPattern = /^\d{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const addressPattern = /^[a-zA-Z0-9\s,'-.]+(\s\d{6})?$/;
    const dailyWagesPattern = /^\d+(\.\d{1,2})?$/;

    if (!namePattern.test(name)) {
      toast.error("Name entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    if (!agePattern.test(age)) {
      toast.error("Age entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    if (!phoneNumberPattern.test(phonenumber)) {
      toast.error("Phone number entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error("Email entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    if (!addressPattern.test(address)) {
      toast.error("Address entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    if (worktype === "dailybased" && !dailyWagesPattern.test(dailywages)) {
      toast.error("Daily wages entered incorrectly", {
        position: "top-center",
        duration: 5000,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/workguru/business/addworker",
        {
          name,
          age,
          phonenumber,
          email,
          gender,
          address,
          worktype,
          dailywages: worktype === "dailybased" ? dailywages : null,
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
        navigate("/business/listofworkers");
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
        <title>Workers Section</title>
      </Helmet>
      <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Workers Application Form
        </h2>
        <div className="my-2 bg-blue-500 h-[1.1px]"></div>
        <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
          <form onSubmit={handleSubmit}>
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
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
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
                  placeholder="25"
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
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
                    placeholder="1234567890"
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                    placeholder="abc@domain.com"
                    onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled selected>
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
                placeholder="123 Main St"
                onChange={(e) => setAddress(e.target.value)}
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
                  onChange={(e) => setWorkType(e.target.value)}
                  required
                >
                  <option value="" disabled selected>
                    Select Work Type
                  </option>
                  <option value="dailybased">Daily Based</option>
                  <option value="taskbased">Task Based</option>
                </select>
              </div>
              {worktype === "dailybased" && (
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
                      placeholder="100"
                      onChange={(e) => setDailyWages(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Add Worker
              </button>
            </div>
          </form>
        </div>
      </div>
    </BusinessSideBarPage>
  );
};

export default AddWorker;
