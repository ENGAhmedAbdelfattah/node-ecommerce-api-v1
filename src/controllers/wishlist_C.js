const asyncHandler = require("express-async-handler");
const UsersModel = require("../models/users_M");

/**
 * @desc    GET logged user Wishlist
 * @route   GET /api/v1/wishlist
 * @access  Private/User
 */

const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet => add field to array in document if fieldvalue not exist
  const user = await UsersModel.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    lesults: user.wishlist.length,
    data: user.wishlist,
  });
});

/**
 * @desc    Add Product to Wishlist
 * @route   POST /api/v1/wishlist
 * @access  Private/User
 */
//  can make it by PUT method but we use CREATE method
const addToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet => add field to array in document if fieldvalue not exist
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        wishlist: req.body.productId, // validate if productId exite or no
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist if it don't exist",
    data: user.wishlist,
  });
});

/**
 * @desc    Remove Product From Wishlist
 * @route   DELETE /api/v1/wishlist/:productId
 * @access  Private/User
 */
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  // $pull => remove field from array in document if fieldvalue exist
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        wishlist: req.params.productId, // validate if productId exite or no
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist if it exist",
    data: user.wishlist,
  });
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getLoggedUserWishlist,
};
