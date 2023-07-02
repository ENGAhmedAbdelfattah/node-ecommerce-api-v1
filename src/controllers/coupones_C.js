const CouponsModel = require("../models/coupons_M");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory/CURDFactory");

/**
 * @desc    Get list of Coupons
 * @route   GET /api/v1/coupons
 * @access  Public/Admin-Manger
 */
const getCoupons = getAll(CouponsModel, "name");

/**
 * @desc    Get spicific Coupons
 * @route   GET /api/v1/coupons/:id
 * @access  Public/Admin-Manger
 */
const getCoupon = getOne(CouponsModel);

/**
 * @desc    Create Coupons
 * @route   POST /api/v1/coupons
 * @access  Private/Admin-Manger
 */
const postCoupon = createOne(CouponsModel);

/**
 * @desc    Update spicific Coupons
 * @route   PUT /api/v1/coupons/:id
 * @access  Private/Admin-Manger
 */
const updateCoupon = updateOne(CouponsModel);

/**
 * @desc    Delete spicific Coupon
 * @route   PUT /api/v1/coupons/:id
 * @access  Private/Admin-Manger
 */
const deleteCoupon = deleteOne(CouponsModel);

module.exports = {
  getCoupons,
  getCoupon,
  postCoupon,
  updateCoupon,
  deleteCoupon,
};
