const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../Models/user");

const loggedInOnly = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

module.exports = loggedInOnly;
