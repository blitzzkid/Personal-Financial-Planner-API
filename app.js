const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

if (app.get("env") !== "test") {
  require("./db");
}

const corsOptions = {
  credentials: true,
  origin: ["https://farmhome.netlify.com", "http://localhost:3001"],
  allowedHeaders: "content-type"
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

const User = require("./routes/users");
app.use("/users", User);

const Profile = require("./routes/profiles");
app.use("/profiles", Profile);

module.exports = app;
