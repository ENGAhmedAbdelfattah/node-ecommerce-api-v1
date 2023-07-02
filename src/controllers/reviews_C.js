const ReviewsModel = require("../models/reviews_M");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory/CURDFactory");

/**
 * @desc    Get list of Reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 * @params  (model, searchKeys)
 */
const getReviews = getAll(ReviewsModel, "title");

/**
 * @desc    Get spicific Reviews
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
const getReview = getOne(ReviewsModel);

/**
 * @desc    Create Reviews
 * @route   POST /api/v1/reviews
 * @access  Private/User
 */
const postReview = createOne(ReviewsModel);

/**
 * @desc    Update spicific Reviews
 * @route   PUT /api/v1/reviews/:id
 * @access  Private/User
 * @params  model, ...deleteFields
 */
const updateReview = updateOne(ReviewsModel, ["user", "product"]);

/**
 * @desc    Delete spicific Review
 * @route   PUT /api/v1/reviews/:id
 * @access  Private/Admin-Manager-User
 */
const deleteReview = deleteOne(ReviewsModel);

module.exports = {
  getReviews,
  getReview,
  postReview,
  updateReview,
  deleteReview,
};
