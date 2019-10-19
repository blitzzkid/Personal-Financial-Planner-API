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

router.get("/:username", async (req, res, next) => {
  try {
    const profile = await Profile.find({ username: req.params.username });
    res.send(profile);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const profile = new Profile(req.body);
    await Profile.init();
    const newProfile = await profile.save();
    res.send(newProfile);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put("/:username", async (req, res, next) => {
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
    res.send(updatedProfile);
  } catch (err) {
    next(err);
  }
});

router.delete("/delete/:username", async (req, res, next) => {
  try {
    const userToDelete = req.params.username;
    await Profile.findOneAndDelete({ username: userToDelete });
    res.send("Successfully deleted user profile");
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
