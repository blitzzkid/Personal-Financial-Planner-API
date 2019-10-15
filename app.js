const express = require("express");
const app = express();

if (app.get("env") !== "test") {
  require("./db");
}

app.use(express.json());

const User = require("./routes/users");
app.use("/users", User);

module.exports = app;
