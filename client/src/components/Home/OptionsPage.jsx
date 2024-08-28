import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const OptionsPage = () => {
  const navigate = useNavigate();

  let Business = () => {
    navigate("/business");
  };

  let Workers = () => {
    navigate("/workers");
  };
  return (
    <>
      <Helmet>
        <title>OptionsPage</title>
      </Helmet>
      {/* Content */}
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-[320px] mx-auto grid grid-cols-1 items-center justify-center min-h-[100px]">
          <h1 className="text-center font-bold sm:text-4xl text-2xl text-blue-600 dark:text-gray-100">
            Your Selection
          </h1>
        </div>

        <div className="max-w-[1320px] min-h-[370px] mx-auto grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Part-1 */}
          <div
            className="bg-cover bg-center bg-no-repeat rounded"
            style={{ backgroundImage: 'url("/BusinessSolution.jpeg")' }}
          >
            <div className="backdrop-contrast-75 bg-black bg-opacity-30 min-h-[320px] m-5 font-bold">
              <h2 className="text-center text-xl text-gray-100 sm:py-3 py-2">
                Business Management
              </h2>
              <div className="grid grid-rows-4 gap-4 text-gray-100 text-lg px-5 py-4">
                <li>Streamlined Operations</li>
                <li>Efficient Stock Management</li>
                <li>Retailers Data Handling</li>
                <li>User-Friendly Interface</li>
              </div>
              <div className="max-w-[140px] mx-auto bg-blue-500 text-white text-center rounded-md hover:bg-blue-400 sm:px-4 sm:py-2 sm:text-xl xs:py-2 xs:text-lg shadow-lg">
                <button onClick={Business}>Enter Here</button>
              </div>
            </div>
          </div>
          {/* Part-2 */}
          <div
            className="bg-cover bg-center bg-no-repeat rounded"
            style={{ backgroundImage: 'url("/WorkersSolution.jpeg")' }}
          >
            <div className="backdrop-contrast-75 bg-black bg-opacity-30 min-h-[320px] m-5 font-bold">
              <h2 className="text-center text-xl text-gray-100 sm:py-3 py-2">
                Workers Management
              </h2>
              <div className="grid grid-rows-4 gap-4 text-gray-100 text-lg px-5 py-4">
                <li>Worker Management</li>
                <li>Workers Attendance System</li>
                <li>Types of Workers</li>
                <li>Wages & Salary Details</li>
              </div>
              <div className="max-w-[140px] mx-auto bg-blue-500 text-white text-center rounded-md hover:bg-blue-400 sm:px-4 sm:py-2 sm:text-xl xs:py-2 xs:text-lg shadow-lg">
                <button onClick={Workers}>Enter Here</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptionsPage;
