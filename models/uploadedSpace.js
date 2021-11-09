const mongoose = require("mongoose");

const uploadedSpaceSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  address: {
    pincode: Number,
    colony: String,
  },
  vehicle: {
    car: {
      type: Number,
      default: 0,
    },
    bike: {
      type: Number,
      default: 0,
    },
  },
});

module.exports = mongoose.model("uploadedSpace", uploadedSpaceSchema);
