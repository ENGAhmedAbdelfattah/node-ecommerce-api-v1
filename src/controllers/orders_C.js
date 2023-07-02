const asyncHandler = require("express-async-handler");
const CartsModel = require("../models/carts_M");
const ApiError = require("../util/errors/errorClass");
const OrdersModel = require("../models/orders_M");
const ProductsModel = require("../models/products_M");
const { getAll, getOne } = require("./handlersFactory/CURDFactory");

/**
 * @desc    Creat cash order
 * @route   POST /api/v1/orders/
 * @access  Private/Admin-Mangaer-User
 */
const getAllOrders = getAll(OrdersModel); // add "setLoggedUserFilterObjectMiddleware" for User to get orders which belong to him only

/**
 * @desc    Creat cash order
 * @route   POST /api/v1/orders/:id
 * @access  Private/Admin-Mangaer-User
 */
const getOrder = getOne(OrdersModel); // add "Middleware" for User to get spicific order which belong to him only

/**
 * @desc    Creat cash order
 * @route   POST /api/v1/orders/:cartId
 * @access  Private/User
 */
const creatCashOrder = asyncHandler(async (req, res, next) => {
  const appSettings = { taxPrice: 0, shippingPrice: 0 }; // create app setting in model and get it by mongoose here
  const { taxPrice, shippingPrice } = appSettings;
  // 1) Get cart depent on cartId
  const { cartId } = req.params;
  const cart = await CartsModel.findById(cartId);
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${cartId}`, 404)
    );
  // 2) Get order price depent on (totalPriceAfterDiscount if exist or totalCartPrice)
  const { cartItems, totalCartPrice, totalPriceAfterDiscount } = cart;
  const cartPrice = totalPriceAfterDiscount
    ? totalPriceAfterDiscount
    : totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) Create order depend on default payment method(PaymentMethodType) => (cash)
  const order = await OrdersModel.create({
    user: req.user._id,
    cartItems,
    taxPrice,
    shippingPrice,
    shippingAddress: req.body.shippingAddress, // the frontend developer make user choose adress from Address list in user collection then send it in body or the backend make in Address Model field is active apply on one Address only then here get active address from Address collection in user collection
    totalOrderPrice,
  });
  // 4) After creating order, decrement product quantity and increment product sold
  if (!order) return next(new ApiError(`Failed to create this order`, 400));
  const bulkOptions = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
  await ProductsModel.bulkWrite(bulkOptions, {});
  // 5) clear card depend on cartId
  await CartsModel.findByIdAndDelete(cartId);
  res.status(201).json({ status: "success", data: order });
});

/**
 * @desc    Creat cash order
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private/Admin-Manager
 */
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await OrdersModel.findByIdAndUpdate(
    id,
    { isPaid: true, paidAt: Date.now() },
    { new: true }
  );
  if (!order)
    return next(new ApiError(`There is no order for this id: ${id}`, 404));
  res.status(200).json({ status: "success", data: order });
});
/**
 * @desc    Creat cash order
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Private/Admin-Manager
 */

const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await OrdersModel.findByIdAndUpdate(
    id,
    { isDelivered: true, deliveredAt: Date.now() },
    { new: true }
  );
  if (!order)
    return next(new ApiError(`There is no order for this id: ${id}`, 404));
  res.status(200).json({ status: "success", data: order });
});




module.exports = {
  getAllOrders,
  getOrder,
  creatCashOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
};

/*  creatCashOrder steps: */
// 1) Get cart depent on cartId
// 2) Get order price depent on cart price (check if coupon applied)
// 3) Create order depend on default payment method(PaymentMethodType) => (cash)
// 4) After creating order, decrement product quantity and increment product sold
// 5) clear card depend on cartId
