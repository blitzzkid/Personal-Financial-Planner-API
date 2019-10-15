const mongoose = require("mongoose");
const dbName = "users-db";

let dbUrl = `mongodb://localhost/${dbName}`;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("We are connected");
});

module.exports = db;
