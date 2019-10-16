const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  birthYear: Number,
  retirementAge: Number,
  passingAge: Number,
  retirementIncome: Number,
  interestRate: Number
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
