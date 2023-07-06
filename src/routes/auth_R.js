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
  logout,
  generateCSRFToken,
  allowTo,
  protect,
  sessionProtect,
} = require("../controllers/auth_C");

const router = express.Router();

router.post("/signup", signupValitatior, signup);
router.post("/login", loginValitatior, login);
router.post("/logout", logout); // add when use cookies to auth
router.post("/forgotpassword", forgotPasswordValitatior, forgotPassword);
router.post("/verifyresetcode", verifyResetCodeValitatior, verifyResetCode);
router.put("/resetpassword", resetPasswordValitatior, resetPassword);
router.get(
  "/csrftoken",
  sessionProtect,
  protect,
  allowTo("admin", "manager", "user"),
  generateCSRFToken
); // add when use cookies to auth

module.exports = router;
