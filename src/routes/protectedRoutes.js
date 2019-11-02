const jwt = require("jsonwebtoken");

const protectedRoutes = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error();
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).end("You are not authorized");
  }
};

module.exports = protectedRoutes;
