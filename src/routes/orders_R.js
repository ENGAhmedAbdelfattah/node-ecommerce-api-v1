const express = require("express");
// const {
// } = require("../util/validator/order_V");

const { protect, allowTo } = require("../controllers/auth_C");
const {
  creatCashOrderValidatior,
  getOrderValidatior,
  updateOrderToPaidValidatior,
  updateOrderToDeliveredValidatior,
  creatCheckoutSessionValidatior,
} = require("../util/validator/order_V");

const {
  creatCashOrder,
  getOrder,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  creatCheckoutSession,
  webhookCheckout,
} = require("../controllers/orders_C");
const setLoggedUserFilterObjectMiddleware = require("../middleware/setLoggedUserFilterObject_MW");

const router = express.Router();

// creat webhook-checkout
router.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

router.use(protect);
router.post(
  "/:cartId",
  allowTo("user"),
  creatCashOrderValidatior,
  creatCashOrder
);
router.post(
  "/checkout-session/:cartId",
  allowTo("user"),
  creatCheckoutSessionValidatior,
  creatCheckoutSession
);

router.get(
  "/",
  allowTo("user", "admin", "manager"),
  setLoggedUserFilterObjectMiddleware,
  getAllOrders
);

router.get(
  "/:id",
  allowTo("user", "admin", "manager"),
  getOrderValidatior,
  setLoggedUserFilterObjectMiddleware,
  getOrder
);

router.put(
  "/:id/pay",
  allowTo("admin", "manager"),
  updateOrderToPaidValidatior,
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  allowTo("admin", "manager"),
  updateOrderToDeliveredValidatior,
  updateOrderToDelivered
);

module.exports = router;
