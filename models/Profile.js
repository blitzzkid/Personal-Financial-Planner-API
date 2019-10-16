const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  birthYear: Number,
  retirementAge: Number,
  passingAge: Number,
  retirementIncome: Number,
  interestRate: Number
});

const Profile = mongoose.model("User", profileSchema);

module.exports = Profile;
