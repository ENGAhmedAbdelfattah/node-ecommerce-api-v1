const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const CartsModel = require("../models/carts_M");
const ApiError = require("../util/errors/errorClass");
const OrdersModel = require("../models/orders_M");
const ProductsModel = require("../models/products_M");
const { getAll, getOne } = require("./handlersFactory/CURDFactory");

const findCartAndPrice = async (cartId) => {
  const appSettings = { taxPrice: 0, shippingPrice: 0 }; // create app setting in model and get it by mongoose here
  const { taxPrice, shippingPrice } = appSettings;
  // 1) Get cart depend on cartId
  const cart = await CartsModel.findById(cartId);
  if (!cart) return { cart };
  // 2) Get order price depend on (totalPriceAfterDiscount if exist or totalCartPrice)
  const { cartItems, totalCartPrice, totalPriceAfterDiscount } = cart;
  const cartPrice = totalPriceAfterDiscount
    ? totalPriceAfterDiscount
    : totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  return { cart, cartItems, totalOrderPrice, taxPrice, shippingPrice };
};

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
  // 1) Get cart depent on cartId and  // 2) Get order price depent on (totalPriceAfterDiscount if exist or totalCartPrice)
  const { cartId } = req.params;
  const { cart, cartItems, totalOrderPrice, taxPrice, shippingPrice } =
    await findCartAndPrice(cartId);
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${cartId}`, 404)
    );
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

/**
 * @desc    creat checkout session from stripe and send it as a response
 * @route   POST /api/v1/orders/checkout-session/:cartId
 * @access  Private/User
 */

const creatCheckoutSession = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const { cart, totalOrderPrice } = await findCartAndPrice(cartId);
  if (!cart)
    return next(
      new ApiError(`There is no cart for this user's id: ${cartId}`, 404)
    );
  // 3) create stripe checkout session (copy from documentation)
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "success", session });
});

const webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === "checkout.session.completed") {
    console.log("create order here...");
  }
  next();
});
module.exports = {
  getAllOrders,
  getOrder,
  creatCashOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  creatCheckoutSession,
  webhookCheckout,
};

/*  creatCashOrder steps: */
// 1) Get cart depent on cartId
// 2) Get order price depent on cart price (check if coupon applied)
// 3) Create order depend on default payment method(PaymentMethodType) => (cash)
// 4) After creating order, decrement product quantity and increment product sold
// 5) clear card depend on cartId

// 1) Get cart depent on cartId
// const { cartId } = req.params;
// const cart = await CartsModel.findById(cartId);
// if (!cart)
//   return next(
//     new ApiError(`There is no cart for this user's id: ${cartId}`, 404)
//   );
// 2) Get order price depent on (totalPriceAfterDiscount if exist or totalCartPrice)'
// const { cartItems, totalCartPrice, totalPriceAfterDiscount } = cart;
// const cartPrice = totalPriceAfterDiscount
//   ? totalPriceAfterDiscount
//   : totalCartPrice;
// const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

// customer_name: req.user.name,
// customer_email: req.user.email,
// customer_phone: req.user.phone,
// customer_address: req.body.shippingAddress,

// old:
// line_items: [
//   {
//     name: req.user.name,
//     amount: totalOrderPrice * 100,
//     currency: "egp",
//     quantity: 1,
//   },
// ],
