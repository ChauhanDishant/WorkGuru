const express = require("express");
const router = express.Router();

const {
  addWorkers,
  getWorkers,
  deleteWorkers,
  editWorkers,
} = require("./../../../controllers/BusinessControllers/BusinessWorkerControllers/BusinessWorker");

const authMiddleware = require("./../../../middlewares/authMiddleware");

// ADD || POST -- Adding the workers data into the database.
router.post("/addworker", authMiddleware, addWorkers);

// GET || GET -- Fetching the data of the workers from the database.
router.get("/listofworkers", authMiddleware, getWorkers);

// DELETE || DELETE -- Deleting the data of the workers into the database.
router.delete("/deleteworkers/:workerId", authMiddleware, deleteWorkers);

// PUT || PUT -- Editing the data of the workers from the database.
router.put("/editworkers/:workerId", authMiddleware, editWorkers);

module.exports = router;
