const createErrForDev = (err) => ({
  message: err.message,
  error: err,
  statusCode: err.statusCode,
  status: err.status,
  isOperation: err.isOperation,
  stack: err.stack,
});

const createErrForProd = (err) => ({
  message: err.message,
  statusCode: err.statusCode,
});

const handleJwtInvalidSignature = () => ({
  message: `Invalid token, please login again`,
  statusCode: 401,
});

const handleJwtExpired = () => ({
  message: `Expired token, please login again`,
  statusCode: 401,
});
// _____________________________________________________________________________________
const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let errObj = null;
  if (err.name === "JsonWebTokenError") {
    errObj = handleJwtInvalidSignature();
  } else if (err.name === "TokenExpiredError") {
    errObj = handleJwtExpired();
  } else {
    errObj = createErrForProd(err);
  }

  if (process.env.NODE_ENV === "development") {
    errObj = createErrForDev(err);
  }

  res.status(err.statusCode).json(errObj);
};

module.exports = globalErrorMiddleware;

// const handleJWTInvalidSignature = () =>
//   new ApiError(`Invalid token, please login again`, 401);
