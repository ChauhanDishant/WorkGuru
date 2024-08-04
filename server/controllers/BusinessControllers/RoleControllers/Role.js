const Roles = require("../../../models/BusinessModels/RoleModels/RoleModels");

const addRoles = async (req, res) => {
  try {
    const { rolename, wages } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    const existingRole = await Roles.find({ rolename: req.body.rolename });
    if (existingRole.length > 0) {
      return res
        .status(201)
        .send({ message: "Role already assigned", success: false });
    }
    const newRole = new Roles({
      rolename,
      wages,
      user: userId,
    });

    await newRole.save();
    res
      .status(201)
      .send({ message: "Roles added Successfully", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error on adding the roles", success: false });
  }
};

const getRoles = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }
    const roles = await Roles.find({ user: userId }).sort({ wages: 1 });
    console.log(roles, userId);
    res.status(200).json({
      message: "Roles retrieved Successfully",
      success: true,
      data: roles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Retrieving the data",
      success: false,
    });
  }
};

const deleteRoles = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    const roleId = req.params.roleId;
    console.log(req.params.roleId);
    if (!roleId) {
      return res.status(400).send({
        message: "Role ID not provided",
        success: false,
      });
    }

    // Assuming you have a Role model to interact with the database
    const role = await Roles.findById(roleId);
    if (!role) {
      return res.status(404).send({
        message: "Role not found",
        success: false,
      });
    }

    await Roles.findByIdAndDelete(roleId);

    return res.status(200).send({
      message: "Role deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error deleting role",
      success: false,
    });
  }
};

const editRoles = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in req.user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const roleId = req.params.roleId; // Extract Role ID from request parameters
    const { rolename, wages } = req.body; // Extract updated role data from request body

    // Validate input
    if (!roleId || !rolename || !wages) {
      return res.status(400).json({
        success: false,
        message: "Role ID, name, and wages are required",
      });
    }

    // Find the role by ID and update it
    const updatedRole = await Roles.findByIdAndUpdate(
      roleId,
      { rolename, wages },
      { new: true } // Return the updated document
    );
    // Check if the role was found and updated
    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { addRoles, getRoles, deleteRoles, editRoles };
