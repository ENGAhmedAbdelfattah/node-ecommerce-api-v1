const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcrypt");

const valitatiorMiddleware = require("../../middleware/validator_MW");
const UsersModel = require("../../models/users_M");

const idRules = check("id").isMongoId().withMessage("Invalid user id format");

const creatRules = [
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
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number, phone number must be in Egypt or Saudi Arabia"
    )
    .optional(),
  check("profileImage").optional(),
  check("role").isString().withMessage("role must be String").optional(),
  check("active").isBoolean().optional(),
  check("profileImage").optional(),
];

const updateRules = [
  check("name")
    .isString()
    .withMessage("Invalid user name type")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .isLength({ max: 32 })
    .withMessage("Too long user name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .isEmail()
    .optional()
    .withMessage("Invalid email address")
    .custom(async (reqEmail) => {
      const user = await UsersModel.findOne({ email: reqEmail });
      if (user) {
        throw new Error("This Email already registered");
      }
      return true;
    }),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number, phone number must be in Egypt or Saudi Arabia"
    )
    .optional(),
  check("profileImage").optional(),
  check("role").isString().withMessage("role must be String").optional(),
  check("active").isBoolean().optional(),
];

const updateUserPassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .custom(async (reqPass, { req }) => {
      const user = await UsersModel.findById(req.params.id);
      if (!user) {
        throw new Error("Id is incorrect");
      }
      // console.log("reqPass", reqPass);
      // console.log("user.password", user.password);

      const isSimilar = await bcrypt.compare(reqPass, user.password);
      console.log(isSimilar);
      if (!isSimilar) {
        throw new Error("Current password is incorrect");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password must be Strong")
    .custom((pass, { req }) => {
      // I add that not found in course
      if (pass === req.body.currentPassword) {
        throw new Error("Password should not similar to currentPassword");
      }
      return true;
    })
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error("Password confirmation must be similar to password");
      }
      return true;
    }),
  check("passwordConfirm") // it not send to db but use in password validator only];
    .notEmpty()
    .withMessage("Password confirmation is required"),
];

const updateLoggedUserPasswordRules = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .custom(async (reqPass, { req }) => {
      const isSimilar = await bcrypt.compare(reqPass, req.user.password);
      if (!isSimilar) {
        throw new Error("Current password is incorrect");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password must be Strong")
    .custom((pass, { req }) => {
      // I add that not found in course
      if (pass === req.body.currentPassword) {
        throw new Error("Password should not similar to currentPassword");
      }
      return true;
    })
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error("Password confirmation must be similar to password");
      }
      return true;
    }),
  check("passwordConfirm") // it not send to db but use in password validator only];
    .notEmpty()
    .withMessage("Password confirmation is required"),
];

const updateLoggedUserDataRules = [
  check("name")
    .isString()
    .withMessage("Invalid user name type")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .isLength({ max: 32 })
    .withMessage("Too long user name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .isEmail()
    .optional()
    .withMessage("Invalid email address")
    .custom(async (reqEmail) => {
      const user = await UsersModel.findOne({ email: reqEmail });
      if (user) {
        throw new Error("This Email already registered");
      }
      return true;
    }),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number, phone number must be in Egypt or Saudi Arabia"
    )
    .optional(),
  // check("profileImage").optional(),
];

const getUserValitatior = [idRules, valitatiorMiddleware];
const creatUserValitatior = [creatRules, valitatiorMiddleware];
const updateUserValitatior = [idRules, updateRules, valitatiorMiddleware];
const updateUserPassValitatior = [
  idRules,
  updateUserPassword,
  valitatiorMiddleware,
];
const deleteUserValitatior = [idRules, valitatiorMiddleware];

const updateLoggedUserPasswordValitatior = [
  updateLoggedUserPasswordRules,
  valitatiorMiddleware,
];

const updateLoggedUserDataValitatior = [
  updateLoggedUserDataRules,
  valitatiorMiddleware,
];

module.exports = {
  getUserValitatior,
  creatUserValitatior,
  updateUserValitatior,
  deleteUserValitatior,
  updateUserPassValitatior,
  updateLoggedUserPasswordValitatior,
  updateLoggedUserDataValitatior,
};

// issue here
// .custom((pass, { req }) => {
//   if (
//     new RegExp(pass, "gi").test(req.body.email.split("@")[0]) &&
//     new RegExp(pass, "gi").test(req.body.name)
//   ) {
//     throw new Error("Password must not inculde in email or name ");
//   }
//   return true;
// }),
