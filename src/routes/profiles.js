const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const protectedRoutes = require("./protectedRoutes");

router.get("/", async (req, res, next) => {
  try {
    const profiles = await Profile.find();
    res.status(200).send(profiles);
  } catch (err) {
    next(err);
  }
});

router.get("/:username", protectedRoutes, async (req, res, next) => {
  try {
    const profile = await Profile.find({ username: req.params.username });
    res.status(200).send(profile);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const profile = new Profile(req.body);
    await Profile.init();
    const newProfile = await profile.save();
    res.status(200).send(newProfile);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put("/:username", protectedRoutes, async (req, res, next) => {
  try {
    const profileToUpdate = req.params.username;
    const updatedProfile = await Profile.findOneAndReplace(
      { username: profileToUpdate },
      {
        username: req.body.username,
        birthYear: req.body.birthYear,
        retirementAge: req.body.retirementAge,
        passingAge: req.body.passingAge,
        retirementIncome: req.body.retirementIncome,
        interestRate: req.body.interestRate
      },
      { new: true }
    );
    res.status(200).send(updatedProfile);
  } catch (err) {
    next(err);
  }
});

router.delete("/", protectedRoutes, async (req, res, next) => {
  try {
    await Profile.findOneAndDelete({ username: req.user.name });
    res.clearCookie("token").send("Successfully deleted user profile");
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
