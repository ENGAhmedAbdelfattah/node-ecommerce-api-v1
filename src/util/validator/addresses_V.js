const { check } = require("express-validator");
const valitatiorMiddleware = require("../../middleware/validator_MW");
const UsersModel = require("../../models/users_M");

const idRules = check("addressId")
  .isMongoId()
  .withMessage("Invalid address id format");

const creatRules = [
  check("alias")
    .isString()
    .withMessage("address alias must be String")
    .notEmpty()
    .withMessage("address alias required")
    .isLength({ min: 3 })
    .withMessage("Too short address alias")
    .isLength({ max: 32 })
    .withMessage("Too long address alias")
    .custom(async (aliasValue) => {
      const address = await UsersModel.findOne({
        addresses: { $elemMatch: { alias: aliasValue } }, //important $elemMatch to match element in array in document
      });
      if (address) throw new Error(`address alias must be unique`);
      return true;
    }),
  check("details")
    .isString()
    .withMessage("address alias must be String")
    .notEmpty()
    .withMessage("address details required"),
  check("phone").isMobilePhone().withMessage("Invalid mobile number"),
  check("city")
    .isAlpha()
    .withMessage("City name must contain only alphabetic characters"),
  check("postalCode").isPostalCode("any").withMessage("Invalid postal code"),
];

const updateRules = [
  check("alias")
    .isString()
    .withMessage("address alias must be String")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short address alias")
    .isLength({ max: 32 })
    .withMessage("Too long address alias")
    .custom(async (aliasValue) => {
      const address = await UsersModel.findOne({
        addresses: { $elemMatch: { alias: aliasValue } }, //important $elemMatch to match element in array in document
      });
      if (address)
        throw new Error(
          "Address's alias value is the same of old value or it exist before"
        );
      return true;
    }),
  check("details")
    .isString()
    .withMessage("address alias must be String")
    .optional(),
  check("phone").isMobilePhone().withMessage("Invalid mobile number"),
  check("city")
    .isAlpha()
    .withMessage("City name must contain only alphabetic characters"),
  check("postalCode").isPostalCode("any").withMessage("Invalid postal code"),
];

const addToAddressesValitatior = [creatRules, valitatiorMiddleware];
const updateAddressValitatior = [updateRules, valitatiorMiddleware];
const removeFromAddressesValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  addToAddressesValitatior,
  updateAddressValitatior,
  removeFromAddressesValitatior,
};
