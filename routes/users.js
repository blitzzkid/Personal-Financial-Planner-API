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

const protectedRoutes = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error();
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).end("You are not authorized");
  }
};

router.get("/:name", protectedRoutes, async (req, res, next) => {
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
    const token = jwt.sign({ name: user.username }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token);
    res.send(user);
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
