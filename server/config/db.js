const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected ${process.env.MONGO_URL}`.bgGreen.white);
  } catch (error) {
    console.log(`There is issue in error ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
