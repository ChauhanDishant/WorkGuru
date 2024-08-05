import React from "react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const navigate = useNavigate();
  let GetStarted = () => {
    navigate("/login");
  };
  return (
    <>
      <Helmet>
        <title>WorkGuru - Your All-in-One Management Solution</title>
      </Helmet>
      <div
        className="xs:bg-cover bg-contain bg-center min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundImage: `url('/HomePage_Image.jpeg')` }}
      >
        <div className="bg-white bg-opacity-85 shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
          <div className="p-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to
              <span className="px-2 text-cyan-700/75 font-[Apple Color Emoji]">
                WorkGuru
              </span>
            </h1>
            <p className="text-black-900 text-[17px] mb-6">
              Manage your stocks, invoices, worker salaries, and attendance
              seamlessly with WorkGuru. Our platform provides an all-in-one
              solution to keep your business organized and efficient.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-base font-semibold sm:px-6 sm:py-3 sm:text-lg lg:px-6 lg:py-3 lg:text-xl hover:bg-blue-600"
              onClick={GetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
