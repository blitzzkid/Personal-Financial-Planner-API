const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

router.get("/", async (req, res, next) => {
  try {
    const profiles = await Profile.find(req.query);
    res.send(profiles);
  } catch (err) {
    next(err);
  }
});
