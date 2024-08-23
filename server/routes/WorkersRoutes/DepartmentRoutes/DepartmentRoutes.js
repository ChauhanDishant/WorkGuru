const express = require("express");
const router = express.Router();

const authMiddleware = require("./../../../middlewares/authMiddleware");
const {
  addDepartments,
  getDepartments,
  deletedepartments,
} = require("./../../../controllers/WorkersControllers/DepartmentControllers/Department");

// POST || Add departments
router.post("/adddepartments", authMiddleware, addDepartments);

router.get("/listofdepartments", authMiddleware, getDepartments);

router.delete(
  "/deletedepartment/:departmentId",
  authMiddleware,
  deletedepartments
);
module.exports = router;
