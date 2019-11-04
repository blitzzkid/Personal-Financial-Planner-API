const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/users");
const profileRouter = require("./routes/profiles");

if (app.get("env") !== "test") {
  require("./db");
}

const corsOptions = {
  credentials: true,
  origin: [
    "https://farmhome.netlify.com",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  allowedHeaders: "content-type"
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/users", userRouter);
app.use("/profiles", profileRouter);

module.exports = app;
