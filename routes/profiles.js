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

// router.put("/:username", async (req, res, next) => {
//   try {
//     const profileToUpdate = req.params.username;
//     const regex = new RegExp(profileToUpdate, "gi");
//     const newProfileDetails = req.body;
//     const updatedProfile = await Profile.findOneAndReplace(
//       { name: regex },
//       { newProfileDetails }
//     );
//     res.send(updatedProfile);
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
