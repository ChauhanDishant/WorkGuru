const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const path = require("path");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://workguru-client.onrender.com/",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
