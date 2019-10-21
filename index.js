require("dotenv").config();
const app = require("./app");
const env = app.get("env");

// const PORT = 3000;
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${env} mode`);
});
