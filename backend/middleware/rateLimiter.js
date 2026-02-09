const rateLimit = require("express-rate-limit");

exports.faceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many face attempts. Try again later."
});