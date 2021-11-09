const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("user");

const register = async (req, res, next) => {
  const user = req.body;

  if (!user) {
    const error = new Error("User details are not sent");
    next(error);
    return;
  }

  try {
    let updatedUser = await User.create(user);
    res.status(201).send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

const login = async (req, res, next) => {
  const u = req.body;

  if (!u) {
    const error = new Error("Login details not sent in request body");
    next(error);
    return;
  }

  if (!u.email || !u.password) {
    const error = new Error("Login details not sent in request body");
    next(error);
    return;
  }

  try {
    let updatedUser = await User.findOne({ email: u.email });
    console.log("updateduser", updatedUser);
    if (!updatedUser) {
      const error = new Error("No matching credentials");
      error.status = 404;
      next(error);
      return;
    }
    updatedUser.checkPassword(u.password, (err, isMatch) => {
      if (err) {
        const error = new Error("No matching credentials");
        error.status = 404;
        return next(error);
      }

      if (!isMatch) {
        const error = new Error("No matching credentials");
        error.status = 404;
        return next(error);
      }

      // generate the token
      const claims = {
        id: updatedUser._id,
        email: updatedUser.email,
      };

      jwt.sign(
        claims,
        "abcd" /* process.env.JWT_SECRET */,
        { expiresIn: 24 * 60 * 60 },
        (err, token) => {
          if (err) {
            err.status = 500;
            return next(err);
          }

          res.json({
            email: updatedUser.email,
            token: token,
          });
        }
      );
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    } else {
      err.status = 500;
    }

    return next(err);
  }
};

module.exports = {
  register,
  login,
};
