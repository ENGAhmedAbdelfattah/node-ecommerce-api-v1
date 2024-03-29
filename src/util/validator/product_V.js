const { check } = require("express-validator");
const slugify = require("slugify");
const valitatiorMiddleware = require("../../middleware/validator_MW");
const CategoriesModel = require("../../models/categories_M");
const SubCategoriesModel = require("../../models/subCategories_M");
const ProductsModel = require("../../models/products_M");

const idRules = check("id")
  .isMongoId()
  .withMessage("Invalid product id format");

const creatRules = [
  check("title")
    .isString()
    .withMessage("Product title must be string")
    .optional()
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      return true;
    }),
  check("description")
    .isString()
    .withMessage("Product desciption must be string")
    .notEmpty()
    .withMessage("desciption required")
    .isLength({ min: 20 })
    .withMessage("Too short product desciption")
    .isLength({ max: 2000 })
    .withMessage("Too Long product desciption"),
  check("quantity")
    .isNumeric()
    .withMessage("Product quantity must be number")
    .notEmpty()
    .withMessage("product quantity required"),
  check("sold")
    .isNumeric()
    .withMessage("Product sold must be number")
    .optional(),
  check("price")
    .isNumeric()
    .withMessage("Product price must be number")
    .notEmpty()
    .withMessage("product price required")
    .isLength({ max: 200_000 })
    .withMessage("product price is very high"),
  check("priceAfterDicount")
    .isNumeric()
    .withMessage("Product price after dicount must be number")
    .toFloat()
    .optional()
    .isLength({ max: 200_000 })
    .withMessage("Product price after dicount is very high")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("product priceAfterDicount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .isArray()
    .withMessage("Product colors must be array")
    .optional(),
  check("imageCover").notEmpty().withMessage("Product image cover required"),
  check("images")
    .isArray()
    .withMessage("Product images must be array")
    .optional(),
  check("category")
    .isMongoId()
    .withMessage("Invalid Id format")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .custom(async (categeryId) => {
      // 1) check category is exist
      const categery = await CategoriesModel.findById(categeryId);
      if (!categery) {
        throw new Error(`No Categery with this id: ${categeryId}`);
      }
      return true;
    }),
  check("subcategories")
    .isArray()
    .withMessage("Product's subcategories must be array")
    .optional()
    .custom(async (subcategoryIds) => {
      // 2) check Subcategory Ids in the array must not be duplicated
      const subcategoryIdsUnique = [...new Set(subcategoryIds)];
      if (subcategoryIdsUnique.length !== subcategoryIds.length) {
        throw new Error(`Subcategory Ids in the array must not be duplicated`);
      }
      return true;
    })
    .custom(async (subcategoryIds) => {
      // 3) check all request subcategories is exist
      // categeryIdArray;
      const subCategories = await SubCategoriesModel.find({
        _id: { $exists: true, $in: subcategoryIds },
      });
      if (
        subcategoryIds.length !== subCategories.length ||
        subCategories.length < 1
      ) {
        throw new Error(`Invalid subcategories Ids`);
      } //can use .countDocuments method
      return true;
    })
    .custom(async (subcategoryIds, { req }) => {
      // 4) get all id of subCategories which belong to request category
      const subcategoryDB = await SubCategoriesModel.find({
        category: req.body.category,
      });
      const subcategoryIdsInDB = subcategoryDB.map((subcategory) =>
        subcategory._id.toString()
      );
      // 5) check subCategories (which belong to request category) include request all subCategories
      const checkerValidSubcategoryIds = (valList, arr) =>
        valList.every((v) => arr.includes(v));

      if (!checkerValidSubcategoryIds(subcategoryIds, subcategoryIdsInDB)) {
        throw new Error(`Subcategories must belong to main Category of it`);
      }
      return true;
    }),
  check("brand").isMongoId().withMessage("Invalid Id format").optional(),
  check("ratingsAverage")
    .isNumeric()
    .withMessage("Product ratings average must be number")
    .optional()
    .isLength({ min: 1, max: 5 })
    .withMessage("Rating range mast be between or equal 1 to 5"),
  check("ratingsQuantity")
    .isNumeric()
    .withMessage("Product price must be number")
    .optional(),
];

const updateRules = [
  check("title")
    .isString()
    .withMessage("Product title must be string")
    .withMessage("product required")
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      return true;
    }),
  check("description")
    .isString()
    .withMessage("Product desciption must be string")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short product desciption")
    .isLength({ max: 2000 })
    .withMessage("Too Long product desciption"),
  check("quantity")
    .isNumeric()
    .withMessage("Product quantity must be number")
    .optional(),
  check("sold")
    .isNumeric()
    .withMessage("Product sold must be number")
    .optional(),
  check("price")
    .isNumeric()
    .withMessage("Product price must be number")
    .optional()
    .isLength({ max: 200_000 })
    .withMessage("product price is very high"),
  check("priceAfterDicount")
    .isNumeric()
    .withMessage("Product price after dicount must be number")
    .toFloat()
    .optional()
    .isLength({ max: 200_000 })
    .withMessage("Product price after dicount is very high")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("product priceAfterDicount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .isArray()
    .withMessage("Product colors must be array")
    .optional(),
  check("imageCover").optional(),
  check("images")
    .isArray()
    .withMessage("Product colors must be array")
    .optional(),
  check("category")
    .isMongoId()
    .withMessage("Invalid Id format")
    .optional()
    .custom(async (categeryId) => {
      const categery = await CategoriesModel.findById(categeryId);
      if (!categery) {
        throw new Error(`No Categery with this id: ${categeryId}`);
      }
      return true;
    }),
  check("subcategories")
    .isArray()
    .withMessage("Product's subcategories must be array")
    .optional()
    .custom(async (subcategoryIds) => {
      // categeryIdArray;
      const subCategories = await SubCategoriesModel.find({
        _id: { $exists: true, $in: subcategoryIds },
      });
      if (
        subcategoryIds.length !== subCategories.length ||
        subCategories.length < 1
      ) {
        throw new Error(`Invalid subcategories Ids`);
      } //can use .countDocuments method
      return true;
    })
    .custom(async (subcategoryIds, { req }) => {
      const productCategory = await ProductsModel.findById(req.params.id); // add in update only not create
      const subcategoryDB = await SubCategoriesModel.find({
        category: req.body.category || productCategory.category, // add in update only not create
      });
      const subcategoryIdsInDB = subcategoryDB.map((subcategory) =>
        subcategory._id.toString()
      );
      const checkerValidSubcategoryIds = (valList, arr) =>
        valList.every((v) => arr.includes(v));
      if (!checkerValidSubcategoryIds(subcategoryIds, subcategoryIdsInDB)) {
        throw new Error(`Subcategories must belong to main Category of it`);
      }
      return true;
    }),
  check("brand").isMongoId().withMessage("Invalid Id format").optional(),
  check("ratingsAverage")
    .isNumeric()
    .withMessage("Product ratings average must be number")
    .optional()
    .isLength({ min: 1, max: 5 })
    .withMessage("Rating range mast be between or equal 1 to 5"),
  check("ratingsQuantity")
    .isNumeric()
    .withMessage("Product price must be number")
    .optional(),
];
const getProductValitatior = [idRules, valitatiorMiddleware];
const creatProductValitatior = [creatRules, valitatiorMiddleware];
const updateProductValitatior = [idRules, updateRules, valitatiorMiddleware];
const deleteProductValitatior = [idRules, valitatiorMiddleware];

module.exports = {
  getProductValitatior,
  creatProductValitatior,
  updateProductValitatior,
  deleteProductValitatior,
};

// other solution
// const subcategoryIdsClone = [...subcategoryIds];
// const IsNotUniqueIds = subcategoryIds.every((val) => {
//   delete subcategoryIdsClone[subcategoryIds.indexOf(val)];
//   return subcategoryIdsClone.includes(val);
// });
// if (IsNotUniqueIds)
//   throw new Error(`Subcategory Ids in the array must not be duplicated`);
