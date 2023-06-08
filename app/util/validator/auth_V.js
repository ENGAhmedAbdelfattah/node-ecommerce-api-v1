const { check } = require("express-validator");
const slugify = require("slugify");
const valitatiorMiddleware = require("../../middleware/validator_MW");
const UsersModel = require("../../models/users_M");

const signupRules = [
  check("name")
    .isString()
    .withMessage("Invalid user name type")
    .notEmpty()
    .withMessage("user required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .isLength({ max: 32 })
    .withMessage("Too long user name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (reqEmail) => {
      const user = await UsersModel.findOne({ email: reqEmail });
      if (user) {
        throw new Error("This Email already registered");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isStrongPassword()
    .withMessage("Password must be Strong")
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"), // it not send to db but use in password validator only
];

const loginRules = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isStrongPassword()
    .withMessage("Password must be Strong"),
];

const forgotPasswordRules = check("email")
  .notEmpty()
  .withMessage("Email required")
  .isEmail()
  .withMessage("Invalid email address");

const verifyResetCodeRules = check("resetCode")
  .notEmpty()
  .withMessage("Code required")
  .isLength({ min: 6, max: 6 })
  .withMessage("Code must be 6 digits number");

const resetPasswordRules = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isStrongPassword()
    .withMessage("New password must be Strong")
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error(
          "Password confirmation must be similar to new password"
        );
      }
      return true;
    }),
  check("passwordConfirm") // it not send to db but use in password validator only];
    .notEmpty()
    .withMessage("Password confirmation is required"),
];

const signupValitatior = [signupRules, valitatiorMiddleware];
const forgotPasswordValitatior = [forgotPasswordRules, valitatiorMiddleware];
const loginValitatior = [loginRules, valitatiorMiddleware];
const verifyResetCodeValitatior = [verifyResetCodeRules, valitatiorMiddleware];
const resetPasswordValitatior = [resetPasswordRules, valitatiorMiddleware];

module.exports = {
  signupValitatior,
  loginValitatior,
  forgotPasswordValitatior,
  verifyResetCodeValitatior,
  resetPasswordValitatior,
};

// .custom(async (reqEmail, { req }) => {
//   const user = await UsersModel.findOne({ email: reqEmail });
//   if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
//     throw new Error(`Incorrect email or password`);
//   }
//   return true;
// })
