const { check } = require("express-validator");

const valitatiorMiddleware = require("../../middleware/validator_MW");

const idRules = check("itemId")
  .isMongoId()
  .withMessage("Invalid cart's item id format");

const addProductToCartRules = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid productId format")
    .notEmpty()
    .withMessage("Product is required"),
  check("quantity")
    .isNumeric()
    .withMessage("Quantity must be number format")
    .optional(),
  check("color").isString().withMessage("Product color must be string"), // can validate if this color exist in product color array in products collection (if color array is required in product)
];
// validate if Quantity available or no
const updateCartItemQuantityRules = check("quantity")
  .isNumeric()
  .withMessage("Quantity must be a number");

const applyCouponRules = check("coupon")
  .isString()
  .withMessage("Coupon must be string format");

const addProductToCartValitatior = [
  addProductToCartRules,
  valitatiorMiddleware,
];

const updateCartItemQuantityValitatior = [
  idRules,
  updateCartItemQuantityRules,
  valitatiorMiddleware,
];

const applyCouponValitatior = [applyCouponRules, valitatiorMiddleware];
// const updateCouponValitatior = [idRules, updateRules, valitatiorMiddleware];
const removeCartItemValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  addProductToCartValitatior,
  updateCartItemQuantityValitatior,
  applyCouponValitatior,
  removeCartItemValitatior,
};
