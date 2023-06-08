const { check } = require("express-validator");
const slugify = require("slugify");

const valitatiorMiddleware = require("../../middleware/validator_MW");
const CategoriesModel = require("../../models/categories_M");

const idRules = check("id")
  .isMongoId()
  .withMessage("Invalid subCategory id format");

const creatRules = [
  check("name")
    .isString()
    .withMessage("Invalid subCategory name type")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("category")
    .isMongoId()
    .withMessage("Invalid category id format")
    .notEmpty()
    .withMessage("SubCategory must be belong to main category")
    .custom(async (categeryId) => {
      const categery = await CategoriesModel.findById(categeryId);
      if (!categery) {
        throw new Error(`No Categery with this id: ${categeryId}`);
      }
    }),
];

const updateRules = [
  check("name")
    .isString()
    .withMessage("Invalid subCategory name type")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("category")
    .isMongoId()
    .withMessage("Invalid category id format")
    .optional()
    .custom(async (categeryId) => {
      const categery = await CategoriesModel.findById(categeryId);
      if (!categery) {
        throw new Error(`No Categery with this id: ${categeryId}`);
      }
    }),
];

const getSubCategoryValitatior = [idRules, valitatiorMiddleware];
const creatSubCategoryValitatior = [creatRules, valitatiorMiddleware];
const updateSubCategoryValitatior = [
  idRules,
  updateRules,
  valitatiorMiddleware,
];
const deleteSubCategoryValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  getSubCategoryValitatior,
  creatSubCategoryValitatior,
  updateSubCategoryValitatior,
  deleteSubCategoryValitatior,
};
