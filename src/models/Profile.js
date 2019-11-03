const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true, unique: true },
  birthYear: { type: Number },
  retirementAge: { type: Number },
  passingAge: { type: Number },
  retirementIncome: { type: Number },
  interestRate: { type: Number }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
