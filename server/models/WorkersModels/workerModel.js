const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Worker name is Required"],
  },
  
});
