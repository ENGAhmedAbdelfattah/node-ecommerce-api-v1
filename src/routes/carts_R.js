const express = require("express");

const {
  addProductToCartValitatior,
  updateCartItemQuantityValitatior,
  applyCouponValitatior,
  removeCartItemValitatior,
} = require("../util/validator/cart_V");

const { protect, allowTo, csrfProtect, sessionProtect } = require("../controllers/auth_C");
const {
  getLoggedUserCart,
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
} = require("../controllers/carts_C");

const router = express.Router();

router.use(sessionProtect, protect, allowTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(
    csrfProtect, // after imageMw beacuse data send in from-data not in req.body and image MW make it in req.body
    addProductToCartValitatior,
    addProductToCart
  )
  .delete(clearCart);

router.put("/applycoupon", applyCouponValitatior, applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantityValitatior, updateCartItemQuantity)
  .delete(removeCartItemValitatior, removeCartItem);

module.exports = router;
