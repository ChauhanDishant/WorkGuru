const express = require("express");
const router = express.Router();
const {
  addRoles,
  getRoles,
  deleteRoles,
  editRoles,
} = require("./../../../controllers/BusinessControllers/RoleControllers/Role");
const middleware = "./../../../middlewares/authMiddleware";
const authMiddleware = require(middleware);

// POST || Adding the ROLES to the Particular Users
router.post("/addroles", authMiddleware, addRoles);

// GET || Getting the ROLES from the Particular Users
router.get("/listofroles", authMiddleware, getRoles);

// DELETE || Deleting the ROLES form the Particular Users
router.delete("/deleteroles/:roleId", authMiddleware, deleteRoles);

// PUT || Editing the ROLES from the Particular Users
router.put("/editroles/:roleId", authMiddleware, editRoles);

module.exports = router;
