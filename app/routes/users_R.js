const express = require("express");
const {
  getUserValitatior,
  creatUserValitatior,
  updateUserValitatior,
  deleteUserValitatior,
  updateUserPassValitatior,
  updateLoggedUserPasswordValitatior,
  updateLoggedUserDataValitatior,
} = require("../util/validator/user_V");
const {
  getUsers,
  getUser,
  postUser,
  updateUser,
  updateUserPass,
  deleteUser,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUser,
  activateLoggedUser,
  // disActiveUser,
} = require("../controllers/users_C");
const userImageProcessingMiddleware = require("../middleware/images_MW/usersImageProcessing_MW");
const {
  uploadImagesMiddleware,
} = require("../middleware/images_MW/uploadImages_MW");
const { protect, allowTo } = require("../controllers/auth_C");

const router = express.Router();

const uploadSingleImageMW = uploadImagesMiddleware("single", "profileImage");

router.use(protect);

router
  .route("/me")
  .get(getLoggedUserData, getUser)
  .put(updateLoggedUserDataValitatior, updateLoggedUserData)
  .delete(deactivateLoggedUser);

router.put(
  "/mechangepassword",
  updateLoggedUserPasswordValitatior,
  updateLoggedUserPassword
);

router.put("/activeme", activateLoggedUser);

// ______________________________________________________________________________________________________
router.use(allowTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(
    uploadSingleImageMW,
    userImageProcessingMiddleware,
    creatUserValitatior,
    postUser
  );
router
  .route("/:id")
  .get(getUserValitatior, getUser)
  .put(
    uploadSingleImageMW,
    userImageProcessingMiddleware,
    updateUserValitatior,
    updateUser
  )
  .delete(deleteUserValitatior, deleteUser); // or use "activeSwitcherUser" alternate of "deleteUser"

router.put("/changepassword/:id", updateUserPassValitatior, updateUserPass);

module.exports = router;
