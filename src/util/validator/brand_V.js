const { check } = require("express-validator");
const slugify = require("slugify");
const valitatiorMiddleware = require("../../middleware/validator_MW");

const idRules = check("id").isMongoId().withMessage("Invalid brand id format");
const creatRules = check("name")
  .isString()
  .withMessage("Invalid brand name type")
  .notEmpty()
  .withMessage("Brand required")
  .isLength({ min: 3 })
  .withMessage("Too short brand name")
  .isLength({ max: 32 })
  .withMessage("Too long brand name")
  .custom((name, { req }) => {
    req.body.slug = slugify(name);
    return true;
  });

const updateRules = check("name")
  .isString()
  .withMessage("Invalid brand name type")
  .notEmpty()
  .withMessage("Should input new name to brand")
  .isLength({ min: 3 })
  .withMessage("Too short brand name")
  .isLength({ max: 32 })
  .withMessage("Too long brand name")
  .custom((name, { req }) => {
    req.body.slug = slugify(name);
    return true;
  });

const getBrandValitatior = [idRules, valitatiorMiddleware];
const creatBrandValitatior = [creatRules, valitatiorMiddleware];
const updateBrandValitatior = [idRules, updateRules, valitatiorMiddleware];
const deleteBrandValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  getBrandValitatior,
  creatBrandValitatior,
  updateBrandValitatior,
  deleteBrandValitatior,
};
