const express = require("express");
const {
  addToWishlistValitatior,
  removeFromWishlistValitatior
} = require("../util/validator/withlist_V");
const {
  getLoggedUserWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist_C");
const { protect, allowTo } = require("../controllers/auth_C");

const router = express.Router();

router.use(protect, allowTo("user"));
router
  .route("/")
  .get(
    getLoggedUserWishlist
  )
  .post(
    addToWishlistValitatior,
    addToWishlist
  );
router.delete(
  "/:productId",
  removeFromWishlistValitatior,
  removeFromWishlist
);

module.exports = router;
