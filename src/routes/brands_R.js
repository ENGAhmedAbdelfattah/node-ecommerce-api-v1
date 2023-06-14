const express = require("express");
const {
  getBrandValitatior,
  creatBrandValitatior,
  updateBrandValitatior,
  deleteBrandValitatior,
} = require("../util/validator/brand_V");
const {
  getBrands,
  getBrand,
  postBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brands_C");
const brandImageProcessingMiddleware = require("../middleware/images_MW/brandsImageProcessing_MW");
const {
  uploadImagesMiddleware,
} = require("../middleware/images_MW/uploadImages_MW");
const { protect, allowTo } = require("../controllers/auth_C");

const router = express.Router();

const uploadSingleImageMW = uploadImagesMiddleware("single", "image");

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowTo("admin", "manager"),
    uploadSingleImageMW,
    brandImageProcessingMiddleware,
    creatBrandValitatior,
    postBrand
  );
router
  .route("/:id")
  .get(getBrandValitatior, getBrand)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadSingleImageMW,
    brandImageProcessingMiddleware,
    updateBrandValitatior,
    updateBrand
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteBrandValitatior,
    deleteBrand
  );

module.exports = router;
