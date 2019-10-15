const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String
});

userSchema.pre("save", async function(next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
