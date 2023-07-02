const express = require("express");
const {
  addToAddressesValitatior,
  removeFromAddressesValitatior,
  updateAddressValitatior,
} = require("../util/validator/addresses_V");

const { protect, allowTo } = require("../controllers/auth_C");
const {
  getLoggedUserAddresses,
  addAddress,
  removeAddress,
  updateAddress,
} = require("../controllers/addresses_C");

const router = express.Router();
router.use(protect, allowTo("user"));
router
  .route("/")
  .get(getLoggedUserAddresses)
  .post(addToAddressesValitatior, addAddress);

router
  .route("/:addressId")
  .put(updateAddressValitatior, updateAddress)
  .delete(removeFromAddressesValitatior, removeAddress);

// updateAddressValitatior,
module.exports = router;
