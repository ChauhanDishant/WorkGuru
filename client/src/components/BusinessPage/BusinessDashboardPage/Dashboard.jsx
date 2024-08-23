import React, { useEffect, useState, useRef } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import { Helmet } from "react-helmet";
import axios from "axios";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import gsap from "gsap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // -------------------- Fetching the Data of Invoices, Total Customers-----------------------------

  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0.0);
  const [customers, setCustomers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState(0.0);

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:5000/";

    const fetchInvoices = async () => {
      try {
        const res = await axios.get("/workguru/business/listofinvoices", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setInvoices(res.data.data);
          toast.success(res.data.message);

          // Calculate total amount here
          const totalAmount = res.data.data.reduce(
            (sum, invoice) => sum + invoice.totalAmount,
            0
          );
          setTotal(totalAmount);

          // calculate total unique customers
          const totalUniqueCustomers = new Set(
            res.data.data.map((invoice) => invoice.customerName)
          ).size;
          setCustomers(totalUniqueCustomers);

          // calculate total pending amount from retailers
          const totalPendingPayments = res.data.data
            .filter((invoice) => invoice.paymentStatus === "pending")
            .reduce((sum, invoice) => {
              const amount = parseFloat(
                String(invoice.totalAmount).replace(/,/g, "")
              );
              return sum + amount;
            }, 0);
          setPendingPayments(totalPendingPayments);
        }
      } catch (err) {
        toast.error(err.message);
        console.log(err.message);
      }
    };

    fetchInvoices();
  }, []); // Empty dependency array ensures this runs only once

  // Function to format numbers
  const formatNumber = (value) => {
    if (value >= 1_00_00_000) {
      return `${(value / 1_00_00_000).toFixed(2)} Crores`; // For crores
    } else if (value >= 1_00_000) {
      return `${(value / 1_00_000).toFixed(2)} Lacs`; // For lacs
    } else {
      return value.toFixed(2); // For values less than 1 lac
    }
  };

  // Group invoices by month and sum their totalAmount
  const groupedInvoices = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.invoiceDate);
    const monthYear = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }

    acc[monthYear] += invoice.totalAmount;

    return acc;
  }, {});

  // Sort the labels by date order
  const sortedLabels = Object.keys(groupedInvoices).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateA - dateB;
  });

  // Prepare data for bar chart
  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: "Sales",
        data: sortedLabels.map((label) => groupedInvoices[label]),
        backgroundColor: sortedLabels.map((label) => {
          const value = groupedInvoices[label];
          if (value > 500000) {
            return "rgba(255, 99, 132, 0.6)"; // Red for values > 5,00,000
          } else if (value > 300000) {
            return "rgba(54, 162, 235, 0.6)"; // Blue for values > 3,00,000
          } else {
            return "rgba(75, 192, 192, 0.6)"; // Green for values <= 3,00,000
          }
        }),
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Bar chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
  };

  // Animation Effects
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the loading animation to finish
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Adjust this duration to match your loading screen

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>WorkGuru - Dashboard</title>
        </Helmet>
        {isLoading ? (
          <>
            <LoadingScreen />
          </>
        ) : (
          <>
            <div className="text-blue-600 text-3xl text-center mb-2 font-bold">
              WorkGuru - Dashboard
            </div>
            <div className="my-6 bg-blue-600 h-[1.1px]"></div>
            {/* Dashboard Events */}
            <div className="max-w-[1420px] grid lg:grid-cols-4 sm:grid-cols-2 gap-3 px-5 py-4">
              {/* 1st Card */}
              <div className="border-[1px] bg-white shadow-md w-full max-w-sm mx-auto h-auto rounded-lg grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 p-4">
                <div className="grid grid-rows-[auto_auto_auto] gap-2">
                  <div className="text-gray-800 text-left uppercase text-xs sm:text-sm">
                    REVENUE
                  </div>
                  <div className="text-gray-800 font-medium">
                    <div className="text-xl sm:text-3xl">
                      ₹ {formatNumber(total)}
                    </div>
                  </div>
                </div>
                <div className="w-[40px] sm:w-[50px] bg-indigo-700 h-[40px] sm:h-[50px] text-white text-lg sm:text-2xl flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path>
                  </svg>
                </div>
              </div>
              {/* 2nd Card */}

              <div className="border-[1px] bg-white shadow-md w-full max-w-sm mx-auto h-auto rounded-lg grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 p-4">
                <div className="grid grid-rows-[auto_auto_auto] gap-2">
                  <div className="text-gray-800 text-left uppercase text-xs sm:text-sm">
                    TOTAL CUSTOMERS
                  </div>
                  <div className="text-gray-800 font-medium">
                    <div className="text-xl sm:text-3xl">{customers}</div>
                  </div>
                </div>
                <div className="w-[40px] sm:w-[50px] bg-pink-600 h-[40px] sm:h-[50px] text-white text-lg sm:text-2xl flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M236,140a8,8,0,0,1-8,8H213.84l-8.6,36.59A16,16,0,0,1,189,188l-4.42-19.42L144.72,136h-33.4l-39.9,32.59a16,16,0,0,1-17.26,1.47l-36-18A8,8,0,0,1,16.16,139a8,8,0,0,1,10.66-3.73L62,153.18l37-30.2a16,16,0,0,1,10.25-3.68h44.53l43.36,32.52,5.8-24.67a16,16,0,0,1,15.56-12.65H228A8,8,0,0,1,236,140ZM200,44a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V112a8,8,0,0,0,16,0V52H192v60a8,8,0,0,0,16,0ZM112,96h32a8,8,0,0,0,0-16H112a8,8,0,0,0,0,16Z"></path>
                  </svg>
                </div>
              </div>
              {/* 3rd Card */}

              <div className="border-[1px] bg-white shadow-md w-full max-w-sm mx-auto h-auto rounded-lg grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 p-4">
                <div className="grid grid-rows-[auto_auto_auto] gap-2">
                  <div className="text-gray-800 text-left uppercase text-xs sm:text-sm">
                    TOTAL ORDERS
                  </div>
                  <div className="text-gray-800 font-medium">
                    <div className="text-xl sm:text-3xl">
                      {invoices.length} Orders
                    </div>
                  </div>
                </div>
                <div className="w-[40px] sm:w-[50px] bg-green-700 h-[40px] sm:h-[50px] text-white text-lg sm:text-2xl flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"></path>
                  </svg>
                </div>
              </div>
              {/* 4th Card */}

              <div className="border-[1px] bg-white shadow-md w-full max-w-sm mx-auto h-auto rounded-lg grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 p-4">
                <div className="grid grid-rows-[auto_auto_auto] gap-2">
                  <div className="text-gray-800 text-left uppercase text-xs sm:text-sm">
                    PENDING PAYMENTS
                  </div>
                  <div className="text-gray-800 font-medium">
                    <div className="text-xl sm:text-3xl">
                      ₹ {formatNumber(pendingPayments)}
                    </div>
                  </div>
                </div>
                <div className="w-[40px] sm:w-[50px] bg-red-600 h-[40px] sm:h-[50px] text-white text-lg sm:text-2xl flex items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* ------------------- Bar Chart Section for Sales Data -------------------- */}
            <div className="max-w-6xl mx-auto mt-10">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </BusinessSideBarPage>
    </>
  );
};

export default Dashboard;
