// (ADMIN) CURD operator
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../util/errors/errorClass");

const UsersModel = require("../models/users_M");

const {
  getAll,
  getOne,
  createOne,
  deleteOne,
  deactivateOne,
} = require("./handlersFactory/CURDFactory");
const createToken = require("../util/encrypt/createToken");

/**
 * @desc    Get list of user
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getUsers = getAll(UsersModel, "name");

/**
 * @desc    Get spicific user
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
const getUser = getOne(UsersModel);

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
const postUser = createOne(UsersModel);

/**
 * @desc    Delete spicific user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
const deleteUser = deleteOne(UsersModel);

/**
 * @desc    Delete spicific user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
const deactivateUser = deactivateOne(UsersModel);

/**
 * @desc    Update spicific user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const bodyClone = { ...req.body };
  delete bodyClone.password;
  console.log(bodyClone);
  const user = await UsersModel.findByIdAndUpdate(req.params.id, bodyClone, {
    new: true,
  });
  if (!user)
    return next(new ApiError(`No user for this id: ${req.params.id}`, 404));
  res.status(200).json({ data: user });
});

/**
 * @desc    Update spicific user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
const updateUserPass = asyncHandler(async (req, res, next) => {
  const user = await UsersModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    }, // should ecrypt
    {
      new: true,
    }
  );
  if (!user)
    return next(new ApiError(`No user for this id: ${req.params.id}`, 404));
  res.status(200).json({ data: user });
});

// _______________________________________________________________________________________________
/**
 * @desc    Get logged user data
 * @route   GET /api/v1/users/me
 * @access  Private/Protect
 */
const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/**
 * @desc    update logged user password
 * @route   PUT /api/v1/users/me/changepassword
 * @access  Private/Protect
 */
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) update user password based on user payload (req.user._id)
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    }, // should ecrypt
    {
      new: true,
    }
  );
  // 2) generate new token
  const token = createToken(user._id);
  // because time of change password > time of old token so create token to be logged to logout
  // or then redirect on client side to loggin page to reloggen again ( generate new token )

  res.status(200).json({ data: user, token });
  next();
});

/**
 * @desc    update logged user data (without password and role)
 * @route   PUT /api/v1/users/me
 * @access  Private/Protect
 */
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const { name, email, phone, profileImage } = req.body;
  const user = await UsersModel.findByIdAndUpdate(
    req.user._id,
    { name, email, phone, profileImage },
    { new: true }
  );
  res.status(200).json({ data: user });
  next();
});

/**
 * @desc    deActive logged user
 * @route   PUT /api/v1/users/me
 * @access  Private/Protect
 */
const deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await UsersModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "success" });
});

// admin can active it
/**
 * @desc    Active logged user
 * @route   PUT /api/v1/users/activeme
 * @access  Private/Protect
 */

// don't work because should login first and when login get error the acount not active
const activateLoggedUser = asyncHandler(async (req, res, next) => {
  await UsersModel.findByIdAndUpdate(req.user._id, { active: true });

  res.status(204).json({ status: "success" });
});

// you can add field myctive for user to active and deactive yourself and then when meactive: false prevent all puplic info about him from appear on site

module.exports = {
  getUsers,
  getUser,
  postUser,
  updateUser,
  deleteUser,
  deactivateUser,
  updateUserPass,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUser,
  activateLoggedUser,
};

// /**
//  * @desc    Update spicific user
//  * @route   PUT /api/v1/users/:id
//  * @access  Private/Admin
//  */
// const updateUser = updateOneUser(UsersModel);
// /**
//  * @desc    Update spicific user
//  * @route   PUT /api/v1/users/:id
//  * @access  Private/Admin
//  */
// const updateUserPass = updateUserPassword(UsersModel); //
