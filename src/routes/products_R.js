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
const reviewsRouter = require("./reviews_R");
const {
  uploadImagesMiddleware,
} = require("../middleware/images_MW/uploadImages_MW");

const gategoryImageProcessingMiddleware = require("../middleware/images_MW/productsImagesProcessing_MW");
const { protect, allowTo } = require("../controllers/auth_C");
const parseCategoriesMiddleware = require("../middleware/parseCategories_MW");

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
    parseCategoriesMiddleware,
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
  .delete(protect, allowTo("admin"), deleteProductValitatior, deleteProduct);

/**
 * @desc    NestRoute: reviews in products
 * @route   /api/v1/products/:idproduct/reviews
 */
router.use("/:idproduct/reviews", reviewsRouter)

module.exports = router;
