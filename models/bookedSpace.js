const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const bookedSpaceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  address: {
    pincode: Number,
    colony: String,
  },
  vehicle: String,
});

module.exports = mongoose.model("bookedSpace", bookedSpaceSchema);
