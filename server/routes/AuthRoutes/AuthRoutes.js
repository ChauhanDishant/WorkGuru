const express = require("express");
const {
  signupController,
  loginController,
  getUserProfile,
  editUserProfile,
} = require("../../controllers/AuthControllers/authCtrl");
const authMiddleware = require("./../../middlewares/authMiddleware");
const router = express.Router();

// REGISTER || POST
router.post("/signup", signupController);

// LOGIN || POST
router.post("/login", loginController);

// Fetch the User-Data || GET
router.get("/profile", authMiddleware, getUserProfile);

// PUT the User-Data || PUT
router.put("/editprofile", authMiddleware, editUserProfile);
module.exports = router;
