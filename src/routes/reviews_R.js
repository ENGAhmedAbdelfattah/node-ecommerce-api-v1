const express = require("express");
const {
  getReviewValitatior,
  creatReviewValitatior,
  updateReviewValitatior,
  deleteReviewValitatior,
} = require("../util/validator/review_V");

const {
  getReviews,
  getReview,
  postReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews_C");

const { protect, allowTo } = require("../controllers/auth_C");
const setNestingFilterObjectMiddleware = require("../middleware/setNestingFilterObject_MW");
const setNestingParentIdToBodyMiddleware = require("../middleware/setNestingParentIdToBody_MW");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setNestingFilterObjectMiddleware("product", "idproduct"), getReviews)
  .post(
    protect,
    allowTo("user"),
    setNestingParentIdToBodyMiddleware("product", "idproduct", true),
    creatReviewValitatior,
    postReview
  ); // should add validation layer to make user can update and delete his review only and create one review only
router
  .route("/:id")
  .get(getReviewValitatior, getReview)
  .put(protect, allowTo("user"), updateReviewValitatior, updateReview)
  .delete(
    protect,
    allowTo("admin", "manager", "user"),
    deleteReviewValitatior,
    deleteReview
  );

module.exports = router;
