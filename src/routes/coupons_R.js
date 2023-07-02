const express = require("express");
const {
  getCouponValitatior,
  creatCouponValitatior,
  updateCouponValitatior,
  deleteCouponValitatior,
} = require("../util/validator/coupon_V");

const { protect, allowTo } = require("../controllers/auth_C");
const {
  getCoupons,
  postCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupones_C");

const router = express.Router();

router.use(protect, allowTo("admin", "manager"));
router.route("/").get(getCoupons).post(creatCouponValitatior, postCoupon);
router
  .route("/:id")
  .get(getCouponValitatior, getCoupon)
  .put(updateCouponValitatior, updateCoupon)
  .delete(deleteCouponValitatior, deleteCoupon);

module.exports = router;
