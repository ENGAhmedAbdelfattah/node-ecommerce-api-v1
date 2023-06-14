const { check } = require("express-validator");
const slugify = require("slugify");
const valitatiorMiddleware = require("../../middleware/validator_MW");

const idRules = check("id")
  .isMongoId() // should add Regex for id because findById not accept another value | console.log(/^[0-9a-f]{24}/.test(id));
  .withMessage("Invalid category id format");
const creatRules = [
  check("name")
    .isString()
    .withMessage("Invalid category name type")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("image").isString().optional(),
];

const updateRules = [
  check("name")
    .isString()
    .withMessage("Invalid category name type")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .optional()
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("image").isString().optional(),
];

const getCategoryValitatior = [idRules, valitatiorMiddleware];
const creatCategoryValitatior = [creatRules, valitatiorMiddleware];
const updateCategoryValitatior = [idRules, updateRules, valitatiorMiddleware];
const deleteCategoryValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  getCategoryValitatior,
  creatCategoryValitatior,
  updateCategoryValitatior,
  deleteCategoryValitatior,
};
