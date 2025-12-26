const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET123");
    req.user = decoded; // user_id + role
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
