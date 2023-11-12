const { check, body } = require("express-validator");

const validatiorMiddleware = require("../../middleware/validator_MW");

const idRules = check("id")
  .isMongoId()
  .withMessage("Invalid mongoose id format");

const cartIdRules = check("cartId")
  .isMongoId()
  .withMessage("Invalid cart's id format");

const creatOrderRules = [
  body("shippingAddress.details")
    .isString()
    .withMessage("address alias must be String")
    .notEmpty()
    .withMessage("address details required"),
  body("shippingAddress.phone")
    .isMobilePhone()
    .withMessage("Invalid mobile number"),
  body("shippingAddress.city").optional(),
  body("shippingAddress.postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid postal code"), // can validate if this color exist in product color array in products collection (if color array is required in product)
];

const creatCashOrderValidatior = [
  cartIdRules,
  creatOrderRules,
  validatiorMiddleware,
];

const getOrderValidatior = [idRules, validatiorMiddleware];
const updateOrderToPaidValidatior = [idRules, validatiorMiddleware];
const updateOrderToDeliveredValidatior = [idRules, validatiorMiddleware];

const creatCheckoutSessionValidatior = [
  cartIdRules,
  creatOrderRules,
  validatiorMiddleware,
];

module.exports = {
  creatCashOrderValidatior,
  getOrderValidatior,
  updateOrderToPaidValidatior,
  updateOrderToDeliveredValidatior,
  creatCheckoutSessionValidatior,
};
