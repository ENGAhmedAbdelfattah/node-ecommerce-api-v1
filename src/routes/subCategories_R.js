const express = require("express");

const {
  getSubCategoryValitatior,
  creatSubCategoryValitatior,
  updateSubCategoryValitatior,
  deleteSubCategoryValitatior,
} = require("../util/validator/subCategory_V");

const {
  getSubCategories,
  getSubCategory,
  postSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategories_C");
const setCategoryIdToBadyMiddleware = require("../middleware/setCategoryIdToBody_MW");
const setFilterObjectMiddleware = require("../middleware/setFilterObject_MW");
const { protect, allowTo } = require("../controllers/auth_C");

// mergeParams: Allow this router to access params from other router
// ex: we want access categoryId from category router
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(setFilterObjectMiddleware, getSubCategories)
  .post(
    protect,
    allowTo("admin", "manager"),
    setCategoryIdToBadyMiddleware,
    creatSubCategoryValitatior,
    postSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValitatior, getSubCategory)
  .put(
    protect,
    allowTo("admin", "manager"),
    updateSubCategoryValitatior,
    updateSubCategory
  )
  .delete(
    protect,
    allowTo("admin", "manager"),
    deleteSubCategoryValitatior,
    deleteSubCategory
  );

module.exports = router;
