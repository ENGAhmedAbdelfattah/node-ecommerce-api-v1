const express = require("express");
const subCategoriesRouter = require("./subCategories_R");
const {
  getCategoryValitatior,
  creatCategoryValitatior,
  updateCategoryValitatior,
  deleteCategoryValitatior,
} = require("../util/validator/category_V");
const {
  getCategories,
  getCategory,
  postCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories_C");
const {
  uploadImagesMiddleware,
} = require("../middleware/images_MW/uploadImages_MW");
const gategoryImageProcessingMiddleware = require("../middleware/images_MW/gategoryImageProcessing_MW");
const { protect, allowTo } = require("../controllers/auth_C");

const router = express.Router();

const uploadSingleImageMW = uploadImagesMiddleware("single", "image");
router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowTo("admin", "manager"),
    uploadSingleImageMW,
    gategoryImageProcessingMiddleware,
    creatCategoryValitatior,
    postCategory
  );
router
  .route("/:id")
  .get(getCategoryValitatior, getCategory)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadSingleImageMW,
    gategoryImageProcessingMiddleware,
    updateCategoryValitatior,
    updateCategory
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteCategoryValitatior,
    deleteCategory
  );

// NestRoute
// /api/v1/categories/:id/subcategories
router.use("/:idcategory/subcategories", subCategoriesRouter);

module.exports = router;
