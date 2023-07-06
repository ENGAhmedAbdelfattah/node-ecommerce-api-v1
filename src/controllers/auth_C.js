// (USER) CURD operator

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const ApiError = require("../util/errors/errorClass");
const UsersModel = require("../models/users_M");
// const sendMailGun = require("../util/email/sendMailGun");
const sendMailGmail = require("../util/email/sendMailGmail");
const createToken = require("../util/encrypt/createToken");
const encryptCode = require("../util/encrypt/encryptCode");
const { sanitizeUser } = require("../util/sanitizeData/sanitizeUser");

// ________________________________________________________________________________________________________________________
/**
 * @desc    Create user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res, next) => {
  // * normal validation on validation layer
  // 1- validation on validation layer (email must not be in db)

  // 2- create user
  const { name, email, password } = req.body;
  // important: must not add role
  // important: add only field of regester not all fields
  // important: encrypt path in mongoose middleware
  const user = await UsersModel.create({
    name,
    email,
    password,
  });
  if (!user) {
    return next(new ApiError(`fialed to create user`, 400));
  }
  // 3- generate JWT
  const token = createToken(user._id);
  // 4- send data
  res.status(201).json({ data: sanitizeUser(user), token });
});

/**
 * @desc    Create user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  // * normal validation on validation layer
  // 1 -validation on here (email must be in db && password must be correct(bcrypt compare))
  // - check valid user
  const { email, password } = req.body;
  // important: must not add role
  // important: add only field of regester not all fields
  const user = await UsersModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ApiError(`Incorrect email or password`, 401));

  // 3- generate JWT
  const token = createToken(user._id);
  // 4- send data
  res.status(200).json({ data: sanitizeUser(user), token });
});

// ________________________________________________________________________________________________________________________
/**
 * @desc verify login (verify authentication)
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist, if exist hold it
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(`You are not login, please login to access this route`, 401)
    );
  }
  // 2) verify token (no change happen, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // important:custom error (Invalid token, Expired token) message and status code for production

  // 3) verify if user is exist or not
  const currentUser = await UsersModel.findById(decoded.userid);
  if (!currentUser) {
    return next(
      new ApiError(
        `The user that belong to this token does no longer exist`,
        401
      )
    );
  }

  if (currentUser.active === false)
    return next(
      new ApiError(
        `This account is deactive, please contact with admin to active it`,
        401
      )
    );

  if (Date.parse(currentUser.passwordChangedAt) / 1000 > decoded.iat) {
    // 4) check if user change his password after token created (by forgot password or by admin update password)
    return next(new ApiError(`Password is changed, please login again`, 401));
  }
  // 5) add user to req no res.locals bcacuse I will use it in validation layer
  req.user = currentUser;
  next();
});

/**
 * @desc verify permission (verify authonization)
 */
const allowTo = (...rols) =>
  asyncHandler((req, res, next) => {
    // 1) access role
    // 2) access registered user (req.user) from protect method in auth_C.js
    if (!rols.includes(req.user.role)) {
      return next(
        new ApiError(`You are not allowed to access this route`, 403)
      );
    }
    next();
  });
// _______________________________________________________________________________________________________________________
/**
 * @desc    forgot password
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Check email is exist ( get user by email)
  const { email } = req.body;
  const user = await UsersModel.findOne({ email });
  if (!user) {
    return next(new ApiError(`There is no user with this eamil ${email}`, 404));
  }

  // 2) Generate hash reset random 6 digits (code) and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = encryptCode(resetCode);

  // save
  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpiration = Date.now() + 10 * 60 * 1000; // 10 min
  user.passwordResetCodeIsVerified = false;
  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name}, \n
  We received a request to reset your password on your E-shop Account.\n
  ${resetCode}\n
  Enter this code to complete the reset.\n
  Thanks for helping us keep your account secure\n
  E-shop team`;

  const isSend = await sendMailGmail({
    email: user.email,
    subject: `Your password reset Code (valid for 10 min)`,
    message,
    // attachments,
    // template,
    // context,
  });
  if (!isSend) {
    // reset save
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiration = undefined;
    user.passwordResetCodeIsVerified = undefined;

    await user.save();
    return next(
      new ApiError(`Faile in sending eamil to this email: ${email}`, 500)
    );
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email" });
  // next();
});

/**
 * @desc    verify reset code
 * @route   POST /api/v1/auth/verifyResetCode
 * @access  Public
 */
const verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = encryptCode(req.body.resetCode);

  const user = await UsersModel.findOne({
    // I think that is no best practice, should get it by email(important) and code
    passwordResetCode: hashedResetCode,
    passwordResetCodeExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ApiError(`Reset code  is invalid, expired or used before`, 400)
    );
  }

  // 2) Reset code valid
  user.passwordResetCodeIsVerified = true;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpiration = undefined;
  await user.save();

  setTimeout(() => {
    user.passwordResetCodeIsVerified = undefined;
    user.save();
  }, 15 * 60 * 1000);

  res.status(200).json({
    status: "Successs",
    message: "You can change your password within 15 minutes",
  });
});

/**
 * @desc    reset password
 * @route   POST /api/v1/auth/resetpassword
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const { email, newPassword } = req.body;
  const user = await UsersModel.findOne({ email });
  if (!user)
    return next(
      new ApiError(`There is no user with this email: ${email}`, 404)
    );
  // 2) check if reset code verified and update password and undefined for code
  if (!user.passwordResetCodeIsVerified)
    return next(
      new ApiError(`Reset code not verified, verified expired or used`, 400)
    );
  user.password = newPassword;
  user.passwordResetCodeIsVerified = undefined;

  await user.save();
  // important: encrypt path in mongoose middleware

  // 3) generate new token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
// _______________________________________________________________________________________________________________________
module.exports = {
  signup,
  login,
  protect,
  allowTo,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};

// console.log(resetCode); // send to user in email
// console.log(hash); // save to user in db

// const attachments = [
//   {
//     filename:
//       "product-f940f30c-95c2-45b7-aa81-b4acbc86d480-1686020135766-cover.jpeg",
//     path: "./app/uploads/products/product-f940f30c-95c2-45b7-aa81-b4acbc86d480-1686020135766-cover.jpeg",
//   },
// ];
// const template = "email";
// const context = { name: user.name, code: resetCode };

// if want send link to email
// 1) create link with codeId and send this link to email
// 2) encrypt for codeId it and save to db
// 3) on route of reset code verify for id

// hint from me: I should if passwordResetCodeExpiration end add
// user.passwordResetCode = undefined;
// user.passwordResetCodeExpiration = undefined;
// user.passwordResetCodeIsVerified = undefined;

// send cookies
// res.cookie("Authorization", `Bearer ${token}`, {
//   maxAge: parseInt(process.env.JWT_EXPIRATION_TIME_MS, 10),
//   httpOnly: true,
// });
