const express = require("express");
const {
  signupValitatior,
  loginValitatior,
  forgotPasswordValitatior,
  verifyResetCodeValitatior,
  resetPasswordValitatior,
} = require("../util/validator/auth_V");
const {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth_C");

const router = express.Router();

router.post("/signup", signupValitatior, signup);
router.post("/login", loginValitatior, login);
router.post("/forgotpassword", forgotPasswordValitatior, forgotPassword);
router.post("/verifyresetcode", verifyResetCodeValitatior, verifyResetCode);
router.put("/resetpassword", resetPasswordValitatior, resetPassword);

module.exports = router;
