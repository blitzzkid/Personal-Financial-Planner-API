const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find(req.query);
    res.send(users);
  } catch (err) {
    next(err);
  }
});

// const protectedRoute = (req,res,next) => {
//   try {
//     if (!req.cookies.token) {
//       throw new Error()
//     }
//   } catch(err) {
//     next()
//   }
// }

router.get("/:name", async (req, res, next) => {
  try {
    const userFirstName = req.params.name;
    const regex = new RegExp(userFirstName, "gi");
    const user = await User.find({ firstName: regex });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const user = new User(req.body);
    User.init();
    const newUser = await user.save();
    res.send(newUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      throw new Error("Wrong password!");
    }
    const token = jwt.sign({ name: user.username }, "secretkey", {
      algorithm: "RS256"
    });
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    err.status = 400;
    next();
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const userToDelete = req.params.id;
    await User.findByIdAndDelete(userToDelete);
    res.send("Successfully deleted user");
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
