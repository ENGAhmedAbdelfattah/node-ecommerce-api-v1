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
} = require("../controllers/orders_C");
const setLoggedUserFilterObjectMiddleware = require("../middleware/setLoggedUserFilterObject_MW");

const router = express.Router();

router.use(protect);
router.route("/:cartId").post(allowTo("user"), creatCashOrder);
allowTo("user", "admin", "manager");

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
