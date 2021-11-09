const express = require("express");

const { register, login } = require("../controllers/authUser");
const {
  getBookedSpace,
  uploadSpace,
  searchSpace,
  bookSpace,
  myBookings,
} = require("../controllers/user");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/upload-space", authenticate, uploadSpace);
router.post("/search-space", authenticate, searchSpace);
router.post("/book-space", authenticate, bookSpace);
router.get("/my-bookings", authenticate, myBookings);
router.get("/booked-space", authenticate, getBookedSpace);



module.exports = router;
