const router = require("express").Router();
const { googleLogin } = require("../Controller/AuthController");

router.post("/google", googleLogin);

module.exports = router;
