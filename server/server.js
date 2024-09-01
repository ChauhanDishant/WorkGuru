const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const path = require("path");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://workguru-client.onrender.com",
];

// Serve static files
app.use(express.static(__dirname + "/public"));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/auth headers to be sent with requests
  optionsSuccessStatus: 200, // For legacy browsers
};

// Apply the CORS middleware
app.use(cors(corsOptions));

// Optional: Error handling for CORS issues
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ message: "CORS error: Access not allowed" });
  } else {
    next(err);
  }
});

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ************************* dotenv config *****************************
dotenv.config();

// ************************* connection Initialized ********************
const connectDB = require("./config/db");
connectDB();

// ************************* middlewares *******************************
app.use(express.json());
app.use(morgan("dev")); // -- app engine

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

// ************************** routes ***********************************

// --------------------- Authentication Routes ----------------------------
app.use("/workguru", require("./routes/AuthRoutes/AuthRoutes"));

// -------------------- 1. Business Routes ---------------------------------
app.use(
  "/workguru/business",
  require("./routes/BusinessRoutes/RoleRoutes/RoleRoutes")
);

app.use(
  "/workguru/business",
  require("./routes/BusinessRoutes/BusinessWorkerRoutes/BusinessWorkerRoutes")
);

app.use(
  "/workguru/business",
  require("./routes/BusinessRoutes/ProductRoutes/ProductRoutes")
);

app.use(
  "/workguru/business",
  require("./routes/BusinessRoutes/StockRoutes/StockRoutes")
);

app.use(
  "/workguru/business",
  require("./routes/BusinessRoutes/RetailerRoutes/RetailerRoutes")
);

app.use(
  "/workguru/business",
  require("./routes/BusinessRoutes/InvoiceRoutes/InvoiceRoutes")
);

// -------------------- 2. Workers Routes ----------------------------------

app.use(
  "/workguru/workers",
  require("./routes/WorkersRoutes/DepartmentRoutes/DepartmentRoutes")
);

app.use(
  "/workguru/workers",
  require("./routes/WorkersRoutes/AttendanceRoutes/AttendanceRoutes")
);

app.use(
  "/workguru/workers",
  require("./routes/WorkersRoutes/LoanRoutes/LoanRoutes")
);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running on ${process.env.NODE_MODE} environment, and App is listening on PORT ${PORT}`
        .bgCyan.white
    );
  } else {
    console.log(`Server issue on Project`.bgRed.white);
  }
});
