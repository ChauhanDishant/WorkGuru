const userModel = require("../../models/UserModels/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup Controller
const signupController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }],
    });

    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user with the hashed password
    const newUser = new userModel({
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      gstNumber: req.body.gstNumber,
      district: req.body.district,
      taluka: req.body.taluka,
    });

    // save the new user to the database
    await newUser.save();

    // send success response
    return res
      .status(201)
      .send({ message: "User Created Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Failed to Create User ${error.message}`,
      success: false,
    });
  }
};

// LoginController
const loginController = async (req, res) => {
  try {
    const { email, password, isGoogleSignIn } = req.body;

    // Check if the user exists in the database
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(201)
        .send({ message: "User does not exist", success: false });
    }

    // If it's a normal email/password login
    if (!isGoogleSignIn) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(201).send({
          message: "Invalid email or password",
          success: false,
        });
      }
    }

    // If it's a Google Sign-In, skip password verification
    // Generate the JWT token for the user
    const generateToken = (userId) => {
      const payload = { id: userId };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      return token;
    };

    const token = generateToken(existingUser._id);

    res.status(200).send({
      message: "Login successful. Just verify the OTP sent to your email",
      success: true,
      token,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Error in logging in", success: false });
  }
};

// Get the user
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ message: "User Not Found", success: false });
    }
    res.status(200).send({
      message: "User Data Fetched Sucessfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", success: false });
  }
};

// Edit the User
const editUserProfile = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Check if password is provided and hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update the user profile
    const updatedUser = await userModel
      .findByIdAndUpdate(req.user._id, updateData, { new: true })
      .select("-password");

    res.status(200).send({
      message: "Profile Updated Successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", success: false });
  }
};

module.exports = {
  signupController,
  loginController,
  getUserProfile,
  editUserProfile,
};
