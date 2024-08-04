const jwt = require("jsonwebtoken");
const Users = require("../models/UserModels/userModel"); // Adjust the path as necessary

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Please authenticate." });
  }
};

module.exports = authMiddleware;
