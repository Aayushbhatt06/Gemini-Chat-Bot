const router = require("express").Router();
const { login, signup,verifyOtp   } = require("../Controller/AuthController");
const {
  signupValidation,
  LoginValidation,
} = require("../Middlewares/LoginValidation");


router.post("/login", LoginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/verifyotp",verifyOtp);


module.exports = router;
