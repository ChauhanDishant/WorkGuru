const workerModel = require("./../../../models/BusinessModels/BusinessWorkerModels/BusinessWorkerModels");

const addWorkers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(201)
        .send({ message: "User not found", success: false });
    }
    const existingUser = await workerModel.find({ email: req.body.email });
    if (existingUser.length > 0) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const newWorker = new workerModel({
      name: req.body.name,
      age: req.body.age,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
      worktype: req.body.worktype,
      dailywages:
        req.body.worktype === "dailybased" ? req.body.dailywages : undefined,
      user: userId,
    });

    await newWorker.save();

    return res
      .status(200)
      .send({ message: "Worker added Successfully", success: true });
  } catch (err) {
    res
      .status(401)
      .send({ message: "Error on adding the Worker", success: false });
    console.log(err);
  }
};

const getWorkers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }
    const workers = await workerModel.find({ user: userId }).sort({ name: 1 });
    console.log(workers, userId);
    res.status(200).json({
      message: "Workers Data retrieved Successfully",
      success: true,
      data: workers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Retrieving the data",
      success: false,
    });
  }
};

const deleteWorkers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    const workerId = req.params.workerId;
    console.log(req.params.workerId);
    if (!workerId) {
      return res.status(400).send({
        message: "Role ID not provided",
        success: false,
      });
    }

    // Assuming you have a Worker model to interact with the database
    const worker = await workerModel.findById(workerId);
    if (!worker) {
      return res.status(404).send({
        message: "Worker not found",
        success: false,
      });
    }

    await workerModel.findByIdAndDelete(worker);

    return res.status(200).send({
      message: "Worker deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error deleting worker",
      success: false,
    });
  }
};

const editWorkers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    const { workerId } = req.params; // Corrected line

    const {
      name,
      age,
      phonenumber,
      email,
      gender,
      address,
      worktype,
      dailywages,
    } = req.body;

    if (
      !name ||
      !age ||
      !phonenumber ||
      !email ||
      !gender ||
      !address ||
      !worktype ||
      !dailywages
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const updatedWorker = await workerModel.findByIdAndUpdate(
      workerId,
      {
        name,
        age,
        phonenumber,
        email,
        gender,
        address,
        worktype,
        dailywages,
      },
      { new: true }
    );

    if (!updatedWorker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }

    res.json({
      success: true,
      data: updatedWorker,
      message: "Worker updated successfully",
    });
  } catch (err) {
    console.error("Error updating worker:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addWorkers, getWorkers, deleteWorkers, editWorkers };
