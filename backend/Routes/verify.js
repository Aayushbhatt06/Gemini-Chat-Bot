const express = require("express");
const loggedInOnly = require("../Middlewares/loggedInOnly");
const router = express.Router();

router.get("/verifyToken", loggedInOnly, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
