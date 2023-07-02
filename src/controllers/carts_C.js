const asyncHandler = require("express-async-handler");
const CartsModel = require("../models/carts_M");
const ProductsModel = require("../models/products_M");
const calcTotalCartPrice = require("../util/cart/calcTotalCartPrice");
const ApiError = require("../util/errors/errorClass");
const CouponsModel = require("../models/coupons_M");

/**
 * @desc    Get logged user Cart
 * @route   POST /api/v1/cart
 * @access  Private/User
 */
const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartsModel.findOne({ user: req.user._id });
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${req.user._id}`, 404)
    );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Add Product to Cart
 * @route   POST /api/v1/cart
 * @access  Private/User
 */
const addProductToCart = asyncHandler(async (req, res, next) => {
  console.log(req.baseUrl);
  const { productId, quantity, color } = req.body;
  const newQuantity = quantity ? quantity : 1;

  // 1) Get logged user cards
  let cart = await CartsModel.findOne({ user: req.user._id });
  // 2) Get product and check quantity if available
  const product = await ProductsModel.findById(productId);
  if (!product)
    return next(
      new ApiError(
        `There is no product for this product's id: ${productId}`,
        404
      )
    );

  if (product.quantity < quantity) {
    return next(
      new ApiError(`There is not available quantity for this product`, 400)
    );
  }

  const saveItemBody = {
    product: productId,
    quantity: newQuantity,
    color,
    price: product.price,
  };

  // 3) create or update cart
  /* scenario one: use don't have any cart => creat cart*/
  if (!cart) {
    cart = await CartsModel.create({
      user: req.user._id,
      cartItems: [saveItemBody],
    });
  } else {
    /* scenario two: cart exist, and cart item exist(same id and color)  => increase quantity of this cart by quantity from body*/
    const { cartItems } = cart;
    const productIndex = cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cartItems[productIndex];
      let quantityItemClone = cartItem.quantity;
      quantityItemClone += newQuantity;

      if (product.quantity < quantityItemClone) {
        return next(
          new ApiError(`There is not available quantity for this product`, 400)
        );
      }

      cartItem.quantity = quantityItemClone;
      cartItems[productIndex] = cartItem;
    } else {
      /* scenario three: cart exist, and cart item don't exist=> push cart item to cartItems array*/
      cartItems.push(saveItemBody);
    }
  }

  calcTotalCartPrice(cart);
  // 4) Save Updated card
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    numCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    update specific cart item quantity
 * @route   PUT /api/v1/cart/itemId
 * @access  Private/User
 */
const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  const cart = await CartsModel.findOne({ user: req.user._id });
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${req.user._id}`, 404)
    );

  const cartItem = cart.cartItems.find(
    (item) => item._id.toString() === itemId
  );
  if (!cartItem)
    return next(
      new ApiError(
        `There is no cart item for this cart item's id: ${itemId}`,
        404
      )
    );
  const product = await ProductsModel.findById(cartItem.product);

  if (product.quantity < quantity) {
    return next(
      new ApiError(`There is not available quantity for this product`, 400)
    );
  }

  cartItem.quantity = quantity;

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "updated cart item's quantity successfully",
    numCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Remove specific cart item
 * @route   DELETE /api/v1/cart/itemId
 * @access  Private/User
 */
const removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartsModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.itemId.toString() }, // validate if itemId exite or no
      },
    },
    {
      new: true,
    }
  );
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your cart if it exist",
    numCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Clear specific cart
 * @route   DELETE /api/v1/cart/
 * @access  Private/User
 */
const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await CartsModel.findOneAndDelete({ user: req.user._id });
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${req.user._id}`, 404)
    );
  res
    .status(204)
    .json({ status: "success", message: "clear cart successfully" });
});

/**
 * @desc    Apply coupon on logged user card
 * @route   PUT /api/v1/cart/applycoupon
 * @access  Private/User
 */
const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get discount from CouponsModel
  const coupon = await CouponsModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) return next(new ApiError(`This coupon invalid or expire`, 400));
  // 2) Get totalCartPrice from CartsModel
  const cart = await CartsModel.findOne({ user: req.user._id });
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${req.user._id}`, 404)
    );
  // 3) Calculation totalPriceAfterDiscount and update it
  cart.totalPriceAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);
  await cart.save();

  res.status(200).json({
    status: "success",
    numCartItems: cart.cartItems.length,
    data: cart,
  });
});

module.exports = {
  getLoggedUserCart,
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
};

// if you want update color is simmilar to update quantity but valitate if color for this item exist before

// const cart = await CartsModel.findOneAndUpdate(
//   { user: req.user._id },
//   {
//     $set: { "cartItems.$[elem].quantity": quantity },
//   },
//   {
//     arrayFilters: [{ "elem._id": req.params.itemId }],
//     new: true,
//   }
// );
