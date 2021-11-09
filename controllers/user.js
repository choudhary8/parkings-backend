const mongoose = require("mongoose");
// const bookedSpace = require("../models/bookedSpace");

const User = mongoose.model("user");
const uploadedSpace = mongoose.model("uploadedSpace");
const bookedSpace = mongoose.model("bookedSpace");

const getBookedSpace = async (req, res, next) => {
  let adminId = res.locals.claims.id;
  console.log("adminId", adminId);

  try {
    let bookedSpaces = await bookedSpace.find({ adminId });
    res.status(200).send(bookedSpaces);
  } catch (error) {
    res.status(500).send(error);
  }
};

const uploadSpace = async (req, res, next) => {
  let details = req.body;
  console.log("Hii");
  const adminId = res.locals.claims.id;
  const uploadingData = { ...details, adminId };
  console.log("adminId", adminId);

  try {
    let space = await uploadedSpace.create(uploadingData);
    res.status(201).send(space);
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

const searchSpace = async (req, res, next) => {
  const details = req.body;
  const colony = details.address.colony;
  const pincode = details.address.pincode;
  const vehicle = details.vehicleType;

  try {
    if (vehicle === "car") {
      let allSpaces = await uploadedSpace.find({
        "address.colony": colony,
        "address.pincode": pincode,
        "vehicle.car": { $gt: 0 },
      });
      res.status(200).send(allSpaces);
    } else if (vehicle === "bike") {
      let allSpaces = await uploadedSpace.find({
        "address.colony": colony,
        "address.pincode": pincode,
        "vehicle.bike": { $gt: 0 },
      });
      res.status(200).send(allSpaces);
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

const bookSpace = async (req, res, next) => {
  const userId = res.locals.claims.id;
  const userEmailId = res.locals.claims.email;
  const details = req.body;
  const vehicle = details.vehicle;
  const bookingData = {
    userId,
    email: userEmailId,
    adminId: details.adminId,
    address: details.address,
    vehicle: details.vehicleType,
  };

  console.log("booking Data", details, bookingData);

  try {
    let bookingSpace = await bookedSpace.create(bookingData);
    console.log("bookedspace", bookingSpace);
    if (bookingSpace) {
      let searchedSpace = await uploadedSpace.findOne({
        adminId: mongoose.Types.ObjectId(details.adminId),
        "address.colony": details.address.colony,
        "address.pincode": details.address.pincode,
      });
      if (details.vehicleType === "car") {
        searchedSpace.vehicle.car = searchedSpace.vehicle.car - 1;
        let updatedData = await uploadedSpace.findByIdAndUpdate(
          { _id: searchedSpace._id },
          { "vehicle.car": searchedSpace.vehicle.car }
        );
        res.status(200).send(updatedData);
      } else if (details.vehicleType === "bike") {
        searchedSpace.vehicle.bike = searchedSpace.vehicle.bike - 1;
        let updatedData = await uploadedSpace.findByIdAndUpdate(
          { _id: searchedSpace._id },
          { "vehicle.bike": searchedSpace.vehicle.bike }
        );
        res.status(200).send(updatedData);
      }
    } else {
      res.status(500).send(error);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const myBookings = async (req, res, next) => {
  const userId = res.locals.claims.id;

  try {
    const bookings = await bookedSpace.find({ userId });

    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  getBookedSpace,
  uploadSpace,
  searchSpace,
  bookSpace,
  myBookings,
};
