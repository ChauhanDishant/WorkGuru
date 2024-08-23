const departmentModel = require("./../../../models/WorkersModels/DepartmentModels/DepartmentModels");
// POST || Add the Department's data

const addDepartments = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    const existingDepartment = await departmentModel.findOne({
      departmentname: req.body.departmentname,
    });
    if (existingDepartment) {
      return res
        .status(409)
        .send({ message: "Department Already Exists", success: false });
    }

    const { departmentname, workers } = req.body;

    const newDepartment = new departmentModel({
      departmentname: departmentname,
      workers: workers,
      user: userId,
    });
    await newDepartment.save();

    return res.status(200).send({
      message: "Department added Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error",
      sucess: false,
    });
  }
};

// GET || Fetch the Departments Data

const getDepartments = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    const DepartmentData = await departmentModel
      .find({ user: userId })
      .sort({ departmentname: 1 });

    console.log(DepartmentData);

    res.status(200).send({
      message: "Department Retrieved Successfully",
      success: true,
      data: DepartmentData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

const deletedepartments = async (req, res) => {
  try {
    const userId = req.user._id;
    const departmentId = req.params.departmentId;
    if (!userId) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    const department = await departmentModel.findById(departmentId);
    if (!department) {
      return res
        .status(404)
        .send({ message: "Department not found", success: false });
    }
    await departmentModel.findByIdAndDelete(departmentId);
    res
      .status(200)
      .send({ message: "Department Deleted Successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};
module.exports = { addDepartments, getDepartments, deletedepartments };
