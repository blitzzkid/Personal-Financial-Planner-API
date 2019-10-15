const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

if (app.get("env") !== "test") {
  require("./db");
}

app.use(cookieParser());
app.use(express.json());

const User = require("./routes/users");
app.use("/users", User);

module.exports = app;
