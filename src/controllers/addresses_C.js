const asyncHandler = require("express-async-handler");
const UsersModel = require("../models/users_M");

/**
 * @desc    GET logged user addresses list
 * @route   GET /api/v1/addresses
 * @access  Private/User
 */

const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  // $addToSet => add field to array in document if fieldvalue not exist
  const user = await UsersModel.findById(req.user._id);

  res.status(200).json({
    status: "success",
    lesults: user.addresses.length,
    data: user.addresses,
  });
});

/**
 * @desc    Add address to addresses list
 * @route   POST /api/v1/addresses
 * @access  Private/User
 */
//  can make it by PUT method but we use CREATE method becuase we may use PUT to edit and update address
const addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet => add field to array in document if fieldvalue not exist
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        addresses: req.body,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Address added successfully if it don't exist",
    data: user.addresses,
  });
});

/**
 * @desc    update address in addresses list
 * @route   POST /api/v1/addresses/id
 * @access  Private/User
 */
const updateAddress = asyncHandler(async (req, res, next) => {
  const bodySet = {};

  Object.keys(req.body).forEach((field) => {
    bodySet[`addresses.$[elem].${field}`] = req.body[field];
  });

  // The $set operator is used to set the value of the specific field within the matched object.
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: bodySet,
    },
    {
      arrayFilters: [{ "elem._id": req.params.addressId }],
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Address updated successfully if it exist",
    data: user.addresses,
  });
});

/**
 * @desc    Remove address From Addresses list
 * @route   DELETE /api/v1/addresses/:addressId
 * @access  Private/User
 */
const removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove field from array in document if fieldvalue exist
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        addresses: { _id: req.params.addressId }, // validate if productId exite or no
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully if it exist",
    data: user.addresses,
  });
});

module.exports = {
  addAddress,
  updateAddress,
  removeAddress,
  getLoggedUserAddresses,
};

// {
//   new:true,
//   upsert: true;
// }
// The upsert: true option is used to indicate that if no document matching the filter criteria is found, a new document should be inserted.

  // The $set operator is used to set the value of the specific field within the matched object.
  // .$. Positional operator $ allows you to iterate through the array and update only the corresponding subdocument
  // .${arrayIndex}. to specific the index in array
  // .${elem}. to specific the index in array + arrayFilters: [{ "elem._id": req.params.addressId }] to update spesific element


// $setOnInsert: {},
// $setOnInsert: This operator is used to specify the fields and their values that should be set only during an insert operation. These fields will be ignored if the update operation is not an insert.

// {
//   $set: { "addresses.$[elem]": { ...req.body, _id: req.params.id } }, //don't work because _id immutable by mongoose, can make _id false, and then use customId is work
// }, //replace old embedded document with new so generate new id! to solve that in following lines of codes
