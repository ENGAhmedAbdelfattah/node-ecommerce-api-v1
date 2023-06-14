const ApiError = require("../util/errors/errorClass");

const allController = (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
};

module.exports = allController;
