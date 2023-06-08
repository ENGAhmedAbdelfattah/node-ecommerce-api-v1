const express = require("express");

// const subCategoriesRouter = require("./subCategories_R");
const {
  getProductValitatior,
  creatProductValitatior,
  updateProductValitatior,
  deleteProductValitatior,
} = require("../util/validator/product_V");
const {
  getProducts,
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products_C");
const {
  uploadImagesMiddleware,
} = require("../middleware/images_MW/uploadImages_MW");

const gategoryImageProcessingMiddleware = require("../middleware/images_MW/productsImagesProcessing_MW");
const { protect, allowTo } = require("../controllers/auth_C");

const router = express.Router();

const uploadMultiImageMW = uploadImagesMiddleware("fields", [
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowTo("admin", "manager", "user"),
    uploadMultiImageMW,
    gategoryImageProcessingMiddleware,
    creatProductValitatior,
    postProduct
  );
router
  .route("/:id")
  .get(getProductValitatior, getProduct)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadMultiImageMW,
    gategoryImageProcessingMiddleware,
    updateProductValitatior,
    updateProduct
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteProductValitatior,
    deleteProduct
  );

// NestRoute
// /api/v1/categories/:id/subcategories
// router.use("/:idproduct/subcategories", subCategoriesRouter);

module.exports = router;
