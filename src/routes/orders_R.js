const express = require("express");
// const {
// } = require("../util/validator/order_V");

const { protect, allowTo } = require("../controllers/auth_C");
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

router.use(protect);
router.post("/:cartId", allowTo("user"), creatCashOrder);
router.post("/checkout-session/:cartId", allowTo("user"), creatCheckoutSession);
router.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
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
  setLoggedUserFilterObjectMiddleware,
  getOrder
);

router.put("/:id/pay", allowTo("admin", "manager"), updateOrderToPaid);
router.put("/:id/deliver", allowTo("admin", "manager"), updateOrderToDelivered);

module.exports = router;
