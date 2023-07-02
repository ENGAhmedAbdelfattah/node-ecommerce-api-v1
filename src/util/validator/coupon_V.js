const { check } = require("express-validator");
const moment = require("moment");

const valitatiorMiddleware = require("../../middleware/validator_MW");

const idRules = check("id").isMongoId().withMessage("Invalid brand id format");
const creatRules = [
  check("name")
    .isString()
    .withMessage("Invalid brand name type")
    .notEmpty()
    .withMessage("Coupon's name is required"),
  check("expire")
    .notEmpty()
    .withMessage("Coupon's expire time is required")
    .custom((expireValue) => {
      if (!moment(expireValue, true).isValid()) {
        throw new Error("Invalid date format");
      }
      if (moment(expireValue).toDate().getTime() < Date.now()) {
        throw new Error("The date has already passed");
      }
      return true
    })
    ,

  check("discount")
    .isFloat()
    .withMessage("Coupon's discount must be Number")
    .notEmpty()
    .withMessage("Coupon's discount value is required"),
];

const updateRules = [
  check("name").isString().withMessage("Invalid brand name type").optional(),
  check("expire")
    .optional()
    .custom((expireValue) => {
      if (!moment(expireValue, true).isValid()) {
        throw new Error("Invalid date format");
      }
      if (moment(expireValue).toDate().getTime() < Date.now()) {
        throw new Error("The date has already passed");
      }
      return true;
    }),
  check("discount")
    .isNumeric()
    .withMessage("Coupon's discount must be Number")
    .optional(),
];

const getCouponValitatior = [idRules, valitatiorMiddleware];
const creatCouponValitatior = [creatRules, valitatiorMiddleware];
const updateCouponValitatior = [idRules, updateRules, valitatiorMiddleware];
const deleteCouponValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  getCouponValitatior,
  creatCouponValitatior,
  updateCouponValitatior,
  deleteCouponValitatior,
};

// what is all date format which moment accept it here     if (!moment(value, true).isValid()
// ISO 8601 format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DDTHH:mm:ss.SSS', etc.
// Short date format: 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', etc.
// Long date format: 'MMMM D, YYYY', 'D MMMM YYYY', 'MMMM D YYYY', etc.
// Time formats: 'HH:mm:ss', 'HH:mm', etc.
// Relative formats: 'today', 'tomorrow', 'yesterday', etc.
// Custom formats: You can define your own custom formats using Moment.js's formatting tokens.
