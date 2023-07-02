const { check } = require("express-validator");
const valitatiorMiddleware = require("../../middleware/validator_MW");
const ReviewsModel = require("../../models/reviews_M");

const idRules = check("id").isMongoId().withMessage("Invalid Review id format");
const idUpdateRules = check("id").custom(async (reviewId, { req }) => {
  const review = await ReviewsModel.findById(reviewId);
  if (!review) {
    throw new Error(`There is no review with this is id: ${reviewId}`);
  }
  // review.user.toString() became review.user._id.toString() after populate
  if (review.user._id.toString() !== req.user._id.toString()) {
    throw new Error(`You are not allowed to perform this action`);
  }
});

const idDeleteRules = check("id").custom(async (reviewId, { req }) => {
  if (req.user.role === "user") {
    const review = await ReviewsModel.findById(reviewId);
    if (!review) {
      throw new Error(`There is no review with this is id: ${reviewId}`);
    }
    // review.user.toString() became review.user._id.toString() after populate
    if (review.user._id.toString() !== req.user._id.toString()) {
      throw new Error(`You are not allowed to perform this action`);
    }
  }
});

const creatRules = [
  check("title").isString().withMessage("Invalid Review title type").optional(),
  check("ratings")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be in range 1 to 5")
    .notEmpty()
    .withMessage("Rating value is required"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (productId, { req }) => {
      const review = await ReviewsModel.findOne({
        // user: req.user._id,
        // user: { _id: req.user._id },
        user: { _id: req.user._id.toString(), name: req.user.name },
        // "user._id": req.user._id.toString(),
        product: productId,
      });
      // user: req.user became "user._id": req.user._id after populate // https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/  https://stackoverflow.com/questions/54752711/how-to-find-by-nested-property-in-mongoose
      if (review) throw new Error("You already created a review before");
      return true;
    }),
];

const updateRules = check("title")
  .isString()
  .withMessage("Invalid Review title type")
  .optional();

const getReviewValitatior = [idRules, valitatiorMiddleware];
const creatReviewValitatior = [creatRules, valitatiorMiddleware];
const updateReviewValitatior = [
  idRules,
  idUpdateRules,
  updateRules,
  valitatiorMiddleware,
];
const deleteReviewValitatior = [idRules, idDeleteRules, valitatiorMiddleware];

module.exports = {
  getReviewValitatior,
  creatReviewValitatior,
  updateReviewValitatior,
  deleteReviewValitatior,
};
