const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://workguru.onrender.com"],
    methods: ["POST", "GET"],
    optionSuccessStatus: 200,
  })
);

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
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

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
