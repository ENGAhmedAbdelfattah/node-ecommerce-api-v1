const express = require("express");
const {
  addProductToCartValitatior,
  updateCartItemQuantityValitatior,
  applyCouponValitatior,
  removeCartItemValitatior,
} = require("../util/validator/cart_V");

const { protect, allowTo } = require("../controllers/auth_C");
const {
  getLoggedUserCart,
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
} = require("../controllers/carts_C");

const router = express.Router();

router.use(protect, allowTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCartValitatior, addProductToCart)
  .delete(clearCart);

router.put("/applycoupon", applyCouponValitatior, applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantityValitatior, updateCartItemQuantity)
  .delete(removeCartItemValitatior, removeCartItem);

module.exports = router;
