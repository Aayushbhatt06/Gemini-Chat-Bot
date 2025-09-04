const router = require("express").Router();
const { login, signup } = require("../Controller/AuthController");
const {
  signupValidation,
  LoginValidation,
} = require("../Middlewares/LoginValidation");


router.post("/login", LoginValidation, login);
router.post("/signup", signupValidation, signup);


module.exports = router;
