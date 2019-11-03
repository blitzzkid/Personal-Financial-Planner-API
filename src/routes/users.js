const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protectedRoutes = require("./protectedRoutes");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find(req.query);
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    const regex = new RegExp(username, "gi");
    const user = await User.find({ username: regex });
    const fullName = { fullName: user[0].fullName };
    res.send(fullName);
  } catch (err) {
    if (err.name === "TypeError") {
      err.status = 400
    }
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
    if (err.name === "MongoError" && err.code === 11000) {
      err.status = 400;
    }
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
    const token = jwt.sign({ name: user.username }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token);
    res.send("Sucessfully logged in!");
  } catch (err) {
    if (err.message === "Wrong password!") {
      err.status = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.delete("/", protectedRoutes, async (req, res, next) => {
  try {
    await User.findOneAndDelete({ username: req.user.name });
    res.send("Successfully deleted user");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
