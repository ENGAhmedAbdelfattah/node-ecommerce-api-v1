const asyncHandler = require("express-async-handler");

const setLoggedUserFilterObjectMiddleware = asyncHandler(
  async (req, res, next) => {
    if (req.user.role === "user") res.locals.filterObject = { user: req.user._id };
    next();
  }
);

module.exports = setLoggedUserFilterObjectMiddleware;
