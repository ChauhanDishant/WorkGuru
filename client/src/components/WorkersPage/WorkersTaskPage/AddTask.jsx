import React, { useState } from "react";
import WorkersSideBarPage from "../WorkersSideBarPage/WorkersSideBarPage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

const AddTask = () => {
  axios.defaults.baseURL = "http://localhost:5000/";

  const [rolename, setRoleName] = useState("");
  const [wages, setWages] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Assume the token is stored in localStorage
      console.log(token);
      const res = await axios.post(
        "/workguru/business/addroles",
        { rolename, wages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Task added Succesfully");
        setRoleName("");
        setWages("");
        navigate("/workers/listoftasks");
      } else {
        toast.error("Tasks is already added");
      }
    } catch (err) {
      console.log(err);
      setError("Error adding Tasks");
    }
  };

  return (
    <>
      <WorkersSideBarPage>
        <Helmet>
          <title>AddTasks</title>
        </Helmet>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-6 max-w-2xl shadow-lg">
          <h2 className="text-2xl font-medium mb-4 text-center">Add-Tasks</h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>
          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
            <form>
              <table className="w-full text-left text-gray-700 border-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Field</th>
                    <th className="border px-4 py-2">Input</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">
                      <label htmlFor="rolename" className="block font-medium">
                        Task-Name
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        id="rolename"
                        name="rolename"
                        className="border border-gray-400 p-[6px] w-full rounded-lg focus:outline-none focus:border-blue-400"
                        placeholder="Welding"
                        value={rolename}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">
                      <label htmlFor="rolewages" className="block font-medium">
                        Wages for Tasks (Rs.)
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="rolewages"
                          name="rolewages"
                          className="border border-gray-400 p-[6px] w-full pr-16 rounded-lg focus:outline-none focus:border-blue-400"
                          placeholder="100"
                          value={wages}
                          onChange={(e) => setWages(e.target.value)}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <span className="text-blue-500">/pieces</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">
                      <label htmlFor="Add Roles" className="block font-medium">
                        Add Tasks
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        type="submit"
                        className="tracking-wide font-semibold bg-green-500 text-gray-100 w-full p-[6px] rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        onClick={handleSubmit}
                      >
                        <i className="bi bi-wrench-adjustable"></i>
                        <span className="ml-3">Add Tasks</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </WorkersSideBarPage>
    </>
  );
};

export default AddTask;
